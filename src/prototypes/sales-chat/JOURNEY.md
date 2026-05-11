# Sales Chat — Journey

> Agent inbox flow. Status: `done` / `wip` / `--`.

| # | Step                                                | Story | Route                              | Status |
|---|-----------------------------------------------------|-------|------------------------------------|--------|
| 1 | Agent opens Sales Chat → sees conversation inbox    | --    | `#/web/sales-chat`                 | done   |
| 2 | Picks a conversation → reads thread + customer card | --    | `#/web/sales-chat/:id`             | done   |
| 3 | Inside 24h window → types and sends free-form reply | --    | (same)                             | done   |
| 4 | Outside 24h window → composer locked, template CTA  | --    | (same)                             | done   |
| 5 | Opens template picker, fills variables, sends       | --    | (same, modal)                      | done   |

## Gaps / future steps

- Inbound real-time updates (web push / SSE) — out of scope
- Template authoring + submission to Meta for approval
- Image / file outbound
- Conversation assignment between agents
