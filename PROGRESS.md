# OceanEmbed Prototype — PROGRESS

## Section 9 build order

| Step | Area | Status |
|------|------|--------|
| 1 | Scaffold / monorepo setup | ✅ Built |
| 2 | Design tokens, AppShell, Sidebar | ✅ Built |
| 3 | Explorer (map, scrubber, modals) | ✅ Built |
| 4 | Profile, Cross-sections, Time-depth, Compare | ✅ Built |
| 5 | Validation, Model Lab, Embedding Explorer, Data Pipeline, Downloads | ✅ Built |
| 6 | Dashboard, Saved Views, Alerts, Docs, Contact | ✅ Built |
| 7 | Auth (Sign-in modal + guest locking) | ✅ Built |
| 8 | Landing page / public pages | ✅ Built |
| 9 | TypeScript check | ✅ 0 errors |
| 10 | Build check | ✅ Checked |
| 11 | Section 11 verification | ✅ Fixes applied, awaiting final manual verification |

## Per-route status

| Route | Content | Controls | Status |
|-------|---------|----------|--------|
| `/` | Landing hero, skill table, pipeline steps, ARGO comparison | — | Built |
| `/explore` | Leaflet map, scrubber, layer/depth toggles | Interactive | Built |
| `/profile` | Plotly profile chart, 4-layer toggles | Interactive | Built |
| `/cross-sections` | Plotly heatmap + contours, 4 presets | Interactive | Built |
| `/time-depth` | Plotly Hovmöller, point/range presets | Interactive | Built |
| `/compare` | Profiles/error/RMSE views | Interactive | Built |
| `/validation` | Full metrics table, chart, filters | Interactive | Built |
| `/model-lab` | Experiment table, training curve, skill bars | Static | Built |
| `/embedding-explorer` | UMAP SVG scatter, cluster legend | Static | Built |
| `/data-pipeline` | 5-step pipeline diagram, data sources table | Static | Built |
| `/downloads` | File list, API endpoints | Static | Built |
| `/how-it-works` | 6 steps with inline SVG diagrams | Static | Built |
| `/docs` | Sidebar nav + full content | Static | Built |
| `/dashboard` | Recent views, alerts, quick links | Interactive | Built |
| `/saved-views` | Bookmark cards | Static | Built |
| `/alerts` | Alert types, alert table | Static | Built |
| `/contact` | Email addresses, contact form | Interactive | Built |
| `/sign-in` | Auth form (modal + standalone) | Interactive | Built |

## Key decisions (see DECISIONS.md)
- ARGO dots on landing page made deterministic (removed Math.random)
- How-it-works figures replaced with inline SVG diagrams (no placeholders)
- Sample data watermark removed everywhere
- Validation page replaced with full interactive ValidationClient
