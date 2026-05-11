# Notification System

A full-stack, real-time notification system designed for scalability and efficiency. This project features a React-based frontend, a Node.js/Express backend, and a custom priority inbox algorithm.

## 🚀 Key Features

- **Real-time Notifications**: Implemented using Server-Sent Events (SSE) for efficient, one-way communication from server to client.
- **Priority Inbox**: A smart ranking system using a Min-Heap based algorithm to surface the most relevant notifications (Placement, Results, Events) based on weight and recency.
- **Custom Logging Middleware**: A robust, reusable middleware for tracking incoming requests and outgoing responses.
- **Responsive UI**: A modern, sleek interface built with Material UI (MUI) and custom styling.
- **Optimized Queries**: Designed for high performance even with millions of notifications, utilizing composite indexing and cursor-based pagination.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Material UI (MUI), Emotion
- **Routing**: React Router 7
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Middleware**: Custom Logging & Request Tracking
- **Utilities**: Axios, Dotenv, CORS

### Database (Design)
- **System**: PostgreSQL
- **Optimization**: Partitioning, Partial Indexing, Redis Caching

## 📂 Project Structure

```text
.
├── notification_app_be/    # Express Backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth and validation middleware
│   │   ├── routes/         # API endpoint definitions
│   │   ├── services/       # Business logic
│   │   └── index.js        # Server entry point
├── notification_app_fe/    # React Frontend App
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── hooks/          # Custom React hooks
│   │   └── App.jsx         # Main application component
├── logging_middleware/     # Standalone Logging Utility
│   └── index.js            # Middleware implementation
└── notification_system_design.md # In-depth system architecture
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AnmolTomar15/E23CSEU2118.git
   cd E23CSEU2118
   ```

2. **Setup Backend**:
   ```bash
   cd notification_app_be
   npm install
   # Create a .env file and add your configurations
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd ../notification_app_fe
   npm install
   npm run dev
   ```

## 📈 Architecture & Design

For detailed information on the API design, database schema, and scaling strategies, please refer to the [Notification System Design](notification_system_design.md) document.

## ⚖️ License

This project is licensed under the ISC License.
