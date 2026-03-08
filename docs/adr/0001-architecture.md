# ADR-0001: Modular Monolith + Queue-backed Translation Jobs

## Status
Accepted

## Decision
Use a modular monolith backend with explicit modules and queue-backed translation workers.

## Consequences
- Faster MVP delivery with clear module boundaries.
- Straightforward local development.
- Clean migration path to microservices when needed.
