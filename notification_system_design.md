# Notification System Design

## Stage 1 — REST API Design

### Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | Fetch all notifications (paginated) |
| GET | `/api/notifications/:id` | Fetch single notification |
| POST | `/api/notifications` | Create a new notification |
| PATCH | `/api/notifications/:id/read` | Mark a notification as read |
| PATCH | `/api/notifications/read-all` | Mark all as read |
| DELETE | `/api/notifications/:id` | Delete a notification |
| GET | `/api/notifications/priority` | Fetch top N priority notifications |

### Endpoint Details

**GET `/api/notifications`**
- **Request headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Query params:** `limit`, `page`, `notification_type`
- **Success response (200):** Array of notification objects.
- **Error responses:** 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

**GET `/api/notifications/:id`**
- **Request headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Success response (200):** Notification object.
- **Error responses:** 401 Unauthorized, 404 Not Found, 500 Internal Server Error

**POST `/api/notifications`**
- **Request headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request body schema:** 
  ```json
  {
    "type": "Event | Result | Placement",
    "message": "string",
    "studentId": "string"
  }
  ```
- **Success response (201):** Notification object created.
- **Error responses:** 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

**PATCH `/api/notifications/:id/read`**
- **Request headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Success response (200):** Updated Notification object.
- **Error responses:** 401 Unauthorized, 404 Not Found, 500 Internal Server Error

**PATCH `/api/notifications/read-all`**
- **Request headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Success response (200):** Confirmation message.
- **Error responses:** 401 Unauthorized, 500 Internal Server Error

**DELETE `/api/notifications/:id`**
- **Request headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Success response (200):** Confirmation message.
- **Error responses:** 401 Unauthorized, 404 Not Found, 500 Internal Server Error

**GET `/api/notifications/priority`**
- **Request headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Query params:** `n` (number of top items)
- **Success response (200):** Array of priority sorted notification objects.
- **Error responses:** 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

### Notification Object Schema
```json
{
  "id": "uuid",
  "type": "Event | Result | Placement",
  "message": "string",
  "timestamp": "ISO 8601 datetime",
  "isRead": false,
  "studentId": "string"
}
```

### Real-time Mechanism
I would implement real-time notifications using Server-Sent Events (SSE). 
- **Endpoint:** `GET /api/notifications/stream`
- **Event format:** Plain text stream with data prefix (e.g., `data: {"id": "uuid", "message": "...", "type": "Result"}\n\n`).
- **Client connection lifecycle:** The client connects using an EventSource. Reconnection happens automatically if the connection drops. The server keeps a persistent HTTP connection open per client.
- **Reasoning:** SSE is unidirectional (server to client) over a standard HTTP connection. Notifications fit this model perfectly, as clients do not need to push real-time data back to the server. SSE is simpler to scale than WebSockets since it doesn't require maintaining full bidirectional socket protocols, relying on regular HTTP features (like HTTP/2 multiplexing).

---

## Stage 2 — Database Schema & Storage Design

### Database Choice
**PostgreSQL** is chosen. It excels at structured relational data and offers strong ACID guarantees. Its native support for `ENUM` types cleanly handles notification categories. Furthermore, PostgreSQL handles indexed queries at scale excellently, which is vital for fetching millions of notifications.

### Schema
```sql
CREATE TYPE notification_type AS ENUM ('Event', 'Result', 'Placement');

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  roll_no VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Sample Queries

**Fetch all unread notifications for student**
```sql
SELECT * FROM notifications 
WHERE student_id = :student_id AND is_read = FALSE 
ORDER BY created_at DESC;
```

**Mark notification as read**
```sql
UPDATE notifications 
SET is_read = TRUE 
WHERE id = :id AND student_id = :student_id;
```

**Fetch paginated notifications with limit/offset**
```sql
SELECT * FROM notifications 
WHERE student_id = :student_id 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 40;
```

**Fetch notifications by type**
```sql
SELECT * FROM notifications 
WHERE student_id = :student_id AND type = 'Placement' 
ORDER BY created_at DESC;
```

### Scaling Concerns
At 50,000 students × 5,000,000 notifications, performance degrades. To address it:
- **Partitioning:** Partition the `notifications` table by `created_at` (e.g., monthly). This restricts index sizes and scan lengths for recent queries.
- **Archiving:** Move old notifications (e.g., > 1 year) to cold storage or an archive table.
- **Read Replicas:** Send intensive `SELECT` queries to a read replica database instance to relieve pressure on the primary.
- **Connection Pooling:** Use PgBouncer to manage the massive influx of database connections instead of relying solely on the application server.

---

## Stage 3 — Query Optimization

**Query under review:**
```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

### Is this query accurate?
- Using `SELECT *` is wasteful because it fetches data that might not be needed. 
- The column naming convention typically in PostgreSQL uses snake_case (`student_id`, `is_read`, `created_at`), not camelCase.

### Why is it slow?
- It triggers a full table scan across 5M rows because there is no index on `student_id` or `is_read`.
- The `ORDER BY` without an index forces a costly filesort operation on the filtered rows in memory or disk.

### What would you change?
Rewrite the query and add a composite index:

```sql
CREATE INDEX idx_notifications_student_unread
ON notifications(student_id, is_read, created_at ASC)
WHERE is_read = false;
```
*Note: A partial index (`WHERE is_read = false`) is used to drastically reduce the index size.*

### Computation cost
A full table scan processes data in O(n) time, physically reading the entire table. B-tree index lookups find the exact start position in O(log n) time and sequentially scan from there, skipping millions of irrelevant rows.

### Should you index every column?
No. Indexing every column causes write amplification, index bloat, and slower `INSERTs`/`UPDATEs` because every index must be updated on write. High index counts also waste memory. Low-cardinality columns (like `is_read` which is boolean) shouldn't be indexed on their own unless part of a composite or partial index.

### Query: Students who got a Placement notification in the last 7 days
```sql
SELECT DISTINCT s.id, s.name, s.email
FROM students s
JOIN notifications n ON n.student_id = s.id
WHERE n.type = 'Placement'
  AND n.created_at >= NOW() - INTERVAL '7 days';
```

---

## Stage 4 — Caching & Performance Strategy

**Strategy Evaluations:**
- **Redis Cache:** Cache `GET /api/notifications?studentId=X` with a TTL of 60s. 
  - *Pros:* Massive DB offload, ultra-fast reads. 
  - *Cons:* Stale data risk, added infra complexity, complicated cache invalidation logic on writes.
- **HTTP Cache Headers:** `Cache-Control: max-age=30` for notification lists. 
  - *Pros:* Zero infra needed, uses browser-native caching. 
  - *Cons:* No server-side control over invalidation, can't clear early when a write occurs.
- **Pagination + Cursor-based fetching:** Fetch top 20 with a cursor instead of all. 
  - *Pros:* Limits query scope drastically preventing huge row sets. 
  - *Cons:* Infinite scroll UI/UX can be slightly more complex to implement.
- **SSE / WebSocket push:** Push new notifications to client instead of polling. 
  - *Pros:* Database is only queried when actual new data exists. 
  - *Cons:* Managing persistent connections scaling requires pub/sub (e.g., Redis pub/sub) across multiple backend instances.
- **Database Read Replica:** Route all `SELECT` queries to a read replica. 
  - *Pros:* Primary DB is protected from read avalanches. 
  - *Cons:* Replication lag, increased infrastructure costs.

**Recommended combo:** Redis (primary cache) + Cursor pagination + SSE for new arrivals.

---

## Stage 6 — Priority Inbox Algorithm

**Priority Formula:** 
`score = weight * recency_factor`
- *weight:* Placement = 3, Result = 2, Event = 1
- *recency_factor:* `1 / (1 + hours_elapsed)` — more recent = higher score

**Efficient top-N maintenance:**
Use a min-heap of size N. When a new notification arrives, compute its score. If `score > heap.min`, pop the minimum and push the new notification. This takes `O(log N)` per insertion versus `O(n log n)` for a full re-sort of all notifications. Working code is implemented in the backend application.
