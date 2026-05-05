# Notification System Design

## Stage 1 - REST API and Realtime Contract
- `GET /api/notifications`
- `GET /api/notifications/:id`
- `POST /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`
- `DELETE /api/notifications/:id`
- `GET /api/notifications/priority`

WebSocket events:
- `notification:new` (server -> client)
- `notification:read` (client -> server)
- `notification:read-all` (client -> server)

## Stage 2 - Database Design
- PostgreSQL with Prisma ORM
- `Student` model and `Notification` model
- `NotificationType` enum: `Event | Result | Placement`
- Compound index on `(studentId, isRead, createdAt)`

## Stage 3 - Query Optimisation
- Prefer selected fields over `SELECT *`
- Add compound indexes for common filters and sort
- Keep indexes focused on `WHERE/JOIN/ORDER BY` usage

## Stage 4 - Caching Strategy
- Redis short TTL for list reads
- Selective invalidation when new notifications are inserted
- WebSocket push to reduce polling

## Stage 5 - Bulk Notification Flow
- Single source of truth: DB insert first
- Queue asynchronous channels (email + in-app push) with BullMQ
- Worker-based retries and backoff

## Stage 6 - Priority Inbox
- Score formula:
  - `score = type_weight / (1 + hours_since_notification)`
  - `Placement=3`, `Result=2`, `Event=1`
- Top-N implemented via backend ranking service and standalone script
