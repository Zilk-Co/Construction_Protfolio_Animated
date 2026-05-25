---
name: Machinery longDescription field
description: longDescription was added to machinery after initial scaffold
---

Added longDescription (text, nullable) to:
1. lib/db/src/schema/machinery.ts — drizzle column
2. lib/api-spec/openapi.yaml — MachineryItem + MachineryInput schemas
3. Ran codegen: pnpm --filter @workspace/api-spec run codegen
4. Admin form (artifacts/portfolio/src/pages/admin/machinery-edit.tsx) uses `(item as any).longDescription` cast until generated types are refreshed

**Why:** longDescription was added mid-project; the generated TypeScript types in @workspace/api-client-react may lag behind until codegen is re-run after any future spec changes.

**How to apply:** After any openapi.yaml change, always run codegen before editing frontend code that uses the generated hooks/types.
