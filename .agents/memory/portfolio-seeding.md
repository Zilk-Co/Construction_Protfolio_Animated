---
name: Portfolio data seeding
description: How to reliably seed categories, projects, machinery via the API
---

Use `node -e "..."` with fetch() for seeding JSON payloads that contain apostrophes or special characters. bash curl with heredoc or inline JSON breaks on apostrophes inside string values.

**Endpoints (no auth needed for public write routes):**
- POST /api/categories — requires name, slug
- POST /api/projects — requires title, slug, categoryId
- POST /api/projects/:id/images — requires imageUrl, isHero, sortOrder
- POST /api/machinery — requires name, slug; longDescription, imageUrl, year, condition, published are optional
- DELETE /api/machinery/:id/delete

**Why:** bash expands apostrophes in single-quoted JSON strings, causing unterminated string errors.
