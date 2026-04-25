SOCIAL APP BACKEND STATUS EXPORT (25/04/2026)

------------------------------------------------------------
1. CORE ARCHITECTURE
------------------------------------------------------------
Backend: NestJS (GraphQL)
API Style: GraphQL (Apollo)

Databases:
- PostgreSQL → Primary database (source of truth)
- Neo4j → Social graph (relationships, likes, follows, feed logic)

Queue System:
- Redis + BullMQ
- Used for async processing (Neo4j sync, notifications)

------------------------------------------------------------
2. AUTH SYSTEM
------------------------------------------------------------
- JWT Authentication enabled
- User extracted from JWT only (NOT from client input)

Example:
ctx.req.user.userId

Security rule:
- Client cannot send userId directly for sensitive actions

------------------------------------------------------------
3. POSTS MODULE
------------------------------------------------------------
Features:
- Create post (JWT user only)
- Get all posts

Flow:
Client → GraphQL → PostgreSQL → Queue → Neo4j

Neo4j structure:
(User)-[:POSTED]->(Post)

------------------------------------------------------------
4. LIKE SYSTEM
------------------------------------------------------------
Supported:
- Post likes
- Comment likes

PostgreSQL:
- Stores like/unlike state (toggle system)

Neo4j relationships:
- (User)-[:LIKES]->(Post)
- (User)-[:LIKES]->(Comment)

Behavior:
- LIKE → MERGE relationship
- UNLIKE → DELETE relationship

------------------------------------------------------------
5. FOLLOW SYSTEM
------------------------------------------------------------
PostgreSQL:
- Stores follow relationships

Neo4j:
- (User)-[:FOLLOWS]->(User)

Features:
- Follow / Unfollow toggle
- JWT-based followerId
- Validation of following user existence

------------------------------------------------------------
6. COMMENT SYSTEM
------------------------------------------------------------
Features:
- Comments linked to posts
- Reply support

Neo4j:
- (User)-[:COMMENTED]->(Comment)
- (Comment)-[:REPLY_TO]->(Comment)

------------------------------------------------------------
7. QUEUE SYSTEM (BULLMQ)
------------------------------------------------------------
Each module has:
- queue.service.ts
- worker.ts

Events:
- post.created
- post.liked
- post.unliked
- comment.liked
- comment.unliked
- user.followed
- user.unfollowed

Purpose:
- Sync PostgreSQL → Neo4j
- Notifications
- Async processing

------------------------------------------------------------
8. NEO4J ROLE
------------------------------------------------------------
Used for:
- Social graph relationships
- Feed generation (future)
- Recommendations
- Engagement tracking

------------------------------------------------------------
9. FIXED ISSUES
------------------------------------------------------------
- Fixed NestJS dependency injection errors
- Fixed Neo4jService module export/import issues
- Fixed follow/like toggle logic
- Fixed missing UNLIKE logic in Neo4j
- Standardized JWT user extraction
- Fixed queue injection issues

------------------------------------------------------------
10. CURRENT LIMITATIONS
------------------------------------------------------------
- Feed algorithm not implemented
- Notifications system partial
- Redis caching not implemented
- Neo4j queries still basic
- No ranking/AI feed yet

------------------------------------------------------------
11. SYSTEM FLOW
------------------------------------------------------------
Client (React Native)
        ↓
GraphQL API (NestJS)
        ↓
PostgreSQL (source of truth)
        ↓
BullMQ Queue (Redis)
        ↓
Workers (Post / Like / Follow)
        ↓
Neo4j Graph Database

------------------------------------------------------------
12. SYSTEM STATUS
------------------------------------------------------------
Auth: OK
Posts: OK
Likes: OK (toggle fixed)
Follows: OK
Comments: PARTIAL
Neo4j Sync: OK
Queue System: OK
Feed System: NOT BUILT

------------------------------------------------------------
13. NEXT PRIORITY FEATURES
------------------------------------------------------------
1. Feed Algorithm (TikTok-style ranking)
2. Notification System
3. Redis caching layer
4. Neo4j optimization for scaling
5. Search system (Elasticsearch)

------------------------------------------------------------
END OF EXPORT
