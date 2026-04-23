========================================================
SOCIAL MEDIA BACKEND PROJECT STATUS (NESTJS GRAPHQL)
DATE: APRIL 2026
========================================================

========================
1. OVERALL ARCHITECTURE
========================

GraphQL API (NestJS)
        ↓
PostgreSQL (Main database: posts, users, likes, comments)
        ↓
Redis (BullMQ Queue system)
        ↓
Worker Layer (Async processing jobs)
        ↓
Neo4j (Social graph: follows, relationships, recommendations)

Optional (future):
WebSockets (Socket.IO for real-time notifications)

========================================================
2. CORE TECH STACK
========================================================

- Backend: NestJS + GraphQL
- Database: PostgreSQL (TypeORM)
- Graph Database: Neo4j
- Queue System: Redis + BullMQ
- Real-time (planned): WebSockets
- Event System: Redis queue (Kafka removed)

========================================================
3. MODULE STATUS
========================================================

------------------------
AUTH MODULE
------------------------
- Basic login implemented
- Issue: "User not found" errors exist
- JWT authentication NOT fully implemented
- User context not consistently used in GraphQL

------------------------
POST MODULE
------------------------
- Posts stored in PostgreSQL
- GraphQL createPost mutation exists
- Post creation triggers Redis queue job

Queue event:
  post.created → Redis Queue

Queue Service:
  - addPostCreatedJob() → ACTIVE (recommended)
  - addPostJob() → LEGACY (should be removed)

------------------------
LIKE MODULE
------------------------
- Polymorphic likes supported:
  ✔ Post likes
  ✔ Comment likes

Features:
- likePost
- unlikePost
- likeComment
- unlikeComment
- countLikes (post/comment)

GraphQL output:
{
  likeCount,
  likedByMe
}

------------------------
COMMENT MODULE
------------------------
- Nested comments supported (recursive replies)
- Features:
  ✔ create comment
  ✔ reply to comment
  ✔ fetch post comments
  ✔ fetch replies

Structure:
- parentCommentId used for nesting

------------------------
FOLLOW MODULE (Neo4j)
------------------------
- Uses Neo4j graph relationships:

  (User)-[:FOLLOWS]->(User)

Features:
- followUser
- unfollowUser
- getFollowers
- getFollowing

Event system:
- Kafka removed
- Moving to Redis/event-driven approach

------------------------
NOTIFICATION SYSTEM
------------------------
Components:
- NotificationService (DB storage)
- NotificationGateway (WebSocket real-time push)
- NotificationConsumer (Kafka-based → currently being removed)

Current status:
- Kafka fully removed
- Notification system being rebuilt using Redis + WebSockets

========================================================
4. REDIS QUEUE SYSTEM (BULLMQ)
========================================================

Queue Name:
  post-queue

Jobs:
  ✔ post.created (ACTIVE - recommended)
  ✖ create-post (DEPRECATED - remove)

Retry Policy:
  attempts: 3
  backoff: exponential (2s base delay)

Purpose:
- Async processing of posts
- Feed generation
- Notification triggering
- Neo4j updates

========================================================
5. NEO4J SOCIAL GRAPH
========================================================

Used for:
- Follow relationships
- Social graph traversal
- Future recommendation engine
- Feed ranking support

========================================================
6. REMOVED / DEPRECATED SYSTEMS
========================================================

✖ Kafka (completely removed due to setup instability)
✖ Bitnami Kafka Docker images (broken/unsupported)
✖ EventEmitter (replaced with Redis queue pattern)
✖ Duplicate queue job types (create-post removed)

========================================================
7. CURRENT ISSUES
========================================================

- GraphQL schema mismatches (some mutations undefined)
- Auth system incomplete (userId handling inconsistent)
- Notification system partially migrated from Kafka
- Some legacy queue methods still present
- Worker system not yet implemented

========================================================
8. CURRENT STRENGTHS
========================================================

✔ Clean GraphQL API structure
✔ PostgreSQL working properly
✔ Neo4j social graph working
✔ Redis queue system functional
✔ Likes system fully polymorphic
✔ Nested comments implemented
✔ Follow system integrated with Neo4j

========================================================
9. NEXT PHASE (IMPORTANT)
========================================================

NEXT STEP:
→ Build Redis Worker System

Worker responsibilities:
- Process post.created jobs
- Update Neo4j graph
- Trigger notifications
- Prepare feed ranking system

This will enable:
- Real-time feed generation
- Notification system
- Social graph expansion
- Recommendation system foundation

========================================================
END OF FILE
========================================================