SOCIAL APP PROJECT STATUS EXPORT
Date: 2026-04-23

========================
1. OVERALL ARCHITECTURE
========================
Backend: NestJS (GraphQL + TypeScript)
Databases:
- PostgreSQL (primary source of truth)
- Neo4j (graph database for relationships, feed, recommendations)

Async / Messaging:
- Redis (BullMQ queue system)

Real-time:
- WebSocket (Notification Gateway)

========================
2. CORE MODULES
========================

User Module:
- User creation (PostgreSQL)
- Queue-based sync to Neo4j (user.created event)
- Prevents duplicate users via service-level control

Post Module:
- Post creation stored in PostgreSQL
- Redis queue emits post.created event
- Worker creates Post node in Neo4j
- Builds relationships (CREATED, SEES feed edges)

Follow System:
- Follow/unfollow via GraphQL mutations
- Stored in Neo4j as FOLLOWS relationships
- Prevented duplicate relationships using MERGE (NOT CREATE)

Notification System:
- Triggered via queue events:
  - post.created
  - post.liked
  - user.followed
- Stored in DB + sent via WebSocket gateway

========================
3. QUEUE SYSTEM (BULLMQ)
========================

Queues:
- post-queue
- user-queue

Workers:
- PostWorker:
  - handles post.created, post.liked
  - syncs Neo4j
  - triggers notifications

- UserWorker:
  - handles user.created
  - syncs Neo4j user nodes

Configuration:
- BullModule.forRoot configured with Redis connection
- BullModule.registerQueue used for queue definitions
- @InjectQueue used in services

========================
4. GRAPH DATABASE (NEO4J)
========================

Nodes:
- User
- Post

Relationships:
- (User)-[:CREATED]->(Post)
- (User)-[:FOLLOWS]->(User)
- (User)-[:SEES]->(Post)

Key Rule:
- MERGE used instead of CREATE to prevent duplicates

========================
5. CURRENT FIXES COMPLETED
========================

- Fixed BullMQ connection error (Worker requires a connection)
- Fixed missing queue registration (registerQueue added)
- Fixed dependency injection issues (QueueModule imports)
- Fixed worker initialization issues
- Fixed duplicate service injection issues
- Fixed Neo4j sync pipeline via workers

========================
6. CURRENT STATUS (STABLE FLOW)

✔ Postgres working
✔ Redis queue working
✔ Workers running
✔ Neo4j syncing correctly
✔ Follow relationships working
✔ Notifications pipeline active

========================
7. ARCHITECTURE FLOW

User/Post Action →
PostgreSQL Save →
Redis Queue Event →
Worker Processing →
Neo4j Sync →
Notification + WebSocket Update

========================
8. KNOWN IMPROVEMENTS NEXT

- Feed ranking algorithm (Neo4j traversal optimization)
- Prevent duplicate follow relationships at API level
- Batch notifications (performance improvement)
- WebSocket room-based delivery per user
- Comment system (nested graph structure)
- Like system with polymorphic graph design
