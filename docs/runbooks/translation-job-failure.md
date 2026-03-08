# Runbook: Translation Job Failure

## Immediate checks
1. Verify `/healthz` and `/readyz`.
2. Inspect logs by `request_id` and `jobId`.
3. Confirm worker registration at startup.

## Mitigation
1. Retry transient failures with backoff.
2. Return validation errors for malformed payloads.
3. Record incident timeline and create follow-up issue.
