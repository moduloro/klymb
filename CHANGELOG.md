# Changelog

All notable changes to this project are documented in this file.

## [0.10.0] - 2025-08-28

- Features:
  - Localize header and footer via `common.json` (US/UK/DE) and `getCommonContent()` deep-merge logic.
  - Home page supports optional `values` section from content with graceful fallback copy.
- Application:
  - `RootLayout` marked dynamic, resolves audience server-side, and passes localized labels to `Header` and `Footer`.
  - `Header` accepts `nav` labels and refreshes after locale change; `Footer` accepts `labels` with safe defaults.
- Content:
  - Added `src/content/{US,UK,DE}/{en,de}/common.json`.
  - Added `values` to `home.json` copies for US/UK/DE.
- Docs:
  - Added `ENVIRONMENT.md` detailing env vars, DB schema, Prisma, Render build/start, and troubleshooting.

[0.10.0]: https://github.com/moduloro/klymb/compare/0.9.1...0.10.0
