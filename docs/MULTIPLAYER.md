# Multiplayer Architecture

Untaggable keeps gameplay simulation independent from transport.

The browser build currently runs locally/offline. `src/net-state.js` defines the shared state shape intended for both offline simulation and future online multiplayer.

## Direction
- Normal Tag: two human players online, with offline bot fallback.
- Zombie Tag: up to four players; tagged runners become infected/taggers.
- Server-authoritative tagging and match timer for online play.
- Clients send movement/input intent rather than deciding tag results.
- Snapshot interpolation can be added without changing movement constants.
- Offline mode never requires a network connection.

## State contract
Snapshots include protocol version, mode, arena, match status/timer/tick, and compact player state. Protocol versioning allows later changes without silently breaking clients.
