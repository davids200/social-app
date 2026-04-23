
---

## 📦 Features

### 🔐 Authentication
- User registration
- Login with JWT
- Protected GraphQL routes
- AuthGuard implementation

### 📝 Posts
- Create posts via GraphQL
- Store posts in PostgreSQL
- Async processing via queue
- Sync to Neo4j graph

### 👥 Social Graph
- Follow / Unfollow users
- Followers & following queries
- Neo4j relationship storage

### ⚡ Queue System
- Redis-based job queue (BullMQ)
- Background processing
- Reliable async execution

### 🧑‍🏭 Worker System
- PostWorker processes queued jobs
- Writes posts into Neo4j
- Ensures data consistency

---

## 🗄️ Databases

### PostgreSQL
- Users
- Posts
- Primary relational storage

### Neo4j
- User nodes
- FOLLOW relationships
- POSTED relationships
- Graph-based queries

### Redis
- Job queue (BullMQ)
- Async processing layer

---

## 🔄 System Flow

```
User Login → JWT Auth ✔
Create Post → PostgreSQL ✔
Queue Job → Redis ✔
Worker Execution → Neo4j ✔
Graph Updated → Relationships ✔
```

---

## 📁 Project Structure

```
src/
│
├── modules/
│   ├── auth/
│   ├── user/
│   ├── post/
│   ├── follow/
│   └── like/
│
├── infrastructure/
│   ├── database/
│   │   └── neo4j/
│   ├── queue/
│   └── workers/
│
├── common/
└── main.ts
```

---

## ⚙️ Installation

### 1. Clone repository
```bash
git clone https://github.com/your-repo/social-app-backend.git
cd social-app-backend