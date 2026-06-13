# BigBoy — TODO

> API Testing Web App (Postman-style) · Next.js 15 + TypeScript · Google TypeScript Style Guide

---

## Project Setup

- [x] Scaffold Next.js 15 with App Router, TypeScript strict mode, no Tailwind
- [x] Install Zustand for state management
- [x] Configure `tsconfig.json` (strict, `@/*` path alias)
- [x] Configure fonts: **Archivo** (labels/UI) + **JetBrains Mono** (code/data) via `next/font/google`
- [x] Write `app/globals.css` — CSS reset, scrollbar styles, selection highlight

---

## Theme System

- [x] Define `ThemeTokens` interface with all CSS variable slots
- [x] Implement three brutalist themes in `lib/themes.ts`:
  - [x] **VOID** — dark bg `#0a0a0a`, green accent `#00d8a0`
  - [x] **PAPER** — light bg `#f1efe7`, heavy black borders, dark-green accent `#00795c`
  - [x] **PUNCH** — pure black bg, lime accent `#c6ff00`
- [x] `themeToCssVars()` helper — maps theme tokens to CSS custom property object
- [x] Apply theme CSS vars on root `<div>` in `AppShell` — all child components use `var(--accent)` etc.
- [x] Theme switcher (VOID / PAPER / PUNCH) in TopBar — switches live without page reload

---

## State Management (Zustand)

- [x] `store/appStore.ts` — single store mirroring prototype state shape
- [x] Actions: `setTheme`, `setMethod`, `setUrl`, `setReqTab`, `setSideTab`, `setRespTab`
- [x] Actions: `toggleMethodOpen`, `toggleEnvOpen`, `closeMenus`, `setEnv`
- [x] Actions: `setLoading`, `setLoadingTick`, `setResponse`
- [x] Param row CRUD: `updateParam`, `toggleParam`, `removeParam`, `addParam`
- [x] Header row CRUD: `updateHeader`, `toggleHeader`, `removeHeader`, `addHeader`
- [x] Auth actions: `setAuthType`, `setAuthToken`, `setAuthUser`, `setAuthPass`
- [x] Body action: `setBody`
- [x] Env var CRUD: `updateEnvVar`, `toggleEnvVar`, `removeEnvVar`, `addEnvVar`
- [x] History: `pushHistory` (capped at 40 entries)
- [x] `loadRequest(method, url, tab?)` — loads a collection/history item into the builder

---

## Shared Types (`types/index.ts`)

- [x] `Theme`, `HttpMethod`, `ReqTab`, `SideTab`, `RespTab`, `AuthType`
- [x] `KeyValueRow`, `AuthState`, `EnvVar`
- [x] `HistoryEntry`, `ResponseHeader`, `ApiResponse`
- [x] `ThemeTokens`, `CollectionItem`

---

## Library Utilities

- [x] `lib/envInterpolation.ts` — `subst(str, vars)` replaces `{{name}}` with active env var values
- [x] `lib/jsonHighlight.tsx` — `hlLine(line)` returns React spans with `var(--syn-*)` colours for JSON tokens (strings, keys, numbers, booleans, nulls, punctuation)
- [x] `lib/httpClient.ts`:
  - [x] `buildUrl(rawUrl, params, vars)` — substitutes vars + appends enabled query params
  - [x] `buildHeaders(headers, auth, method, body, vars)` — merges header rows + auth injection + auto Content-Type
  - [x] `fmtSize(n)` — formats bytes to B / KB / MB
  - [x] `mock(url, method)` — returns plausible JSONPlaceholder mock response when network is blocked
- [x] `lib/themes.ts` — `THEMES` map + `METHOD_COLORS` + `themeToCssVars()`

---

## HTTP Request Hook (`hooks/useApiRequest.ts`)

- [x] `send()` — async function that:
  - [x] Reads current state from store (method, url, params, headers, auth, body, env vars)
  - [x] Builds resolved URL + headers via `httpClient` helpers
  - [x] Sets `loading: true`, clears previous response, closes open menus
  - [x] Animates `loadingTick` via `setInterval` (220 ms) — drives WAITING... animation
  - [x] Calls native `fetch()` with resolved URL, headers, and optional body
  - [x] On success: records timing, parses response headers, calls `pushHistory`, sets response
  - [x] On network error: falls back to `mock()` with `note` flag, still records history
  - [x] Stops interval timer in all paths (success, error, finally)

---

## TopBar (`components/layout/TopBar.tsx`)

- [x] BigBoy logo — accent square + ARCHIVO 900 wordmark + "API CLIENT" mono badge
- [x] Environment dropdown — shows current env name with accent dot; opens env list
  - [x] Environments: DEV / STAGING / PROD (from `envVars` keys)
  - [x] Click-away overlay closes dropdown
  - [x] Hover highlight on env items
- [x] Theme switcher — three buttons (VOID / PAPER / PUNCH); active has accent background

---

## Sidebar (`components/layout/Sidebar.tsx` + panels)

- [x] Sidebar tab bar: COLLECTIONS / HISTORY / ENV
  - [x] Active tab has accent underline + panel2 background
- [x] **CollectionsPanel** (`components/sidebar/CollectionsPanel.tsx`)
  - [x] "JSONPlaceholder" group header with accent arrow
  - [x] 8 pre-built requests (GET /users, GET /users/1, GET /posts, GET /todos/1, POST /posts, PUT /posts/1, PATCH /posts/1, DELETE /posts/1)
  - [x] Method label coloured by `METHOD_COLORS`
  - [x] Click loads method + URL into request builder; navigates to appropriate tab (params for GET/DELETE, body for others)
  - [x] Hover: background + left border accent highlight
- [x] **HistoryPanel** (`components/sidebar/HistoryPanel.tsx`)
  - [x] Empty state: "NO REQUESTS YET ↳ hit SEND to log one"
  - [x] Each entry: method (coloured) + truncated URL path + time + timestamp
  - [x] Status badge coloured by code range (2xx accent, 4xx amber, 5xx red)
  - [x] Click re-loads that request into the builder
- [x] **EnvironmentsPanel** (`components/sidebar/EnvironmentsPanel.tsx`)
  - [x] Shows current env name as heading (e.g. "DEV · Variables")
  - [x] Editable key-value rows with toggle checkbox + remove button
  - [x] "+ ADD VARIABLE" dashed button
  - [x] Usage hint showing `{{base_url}}/users/1` syntax

---

## Request Builder

### URL Bar (`components/request/UrlBar.tsx`)

- [x] Method picker dropdown — coloured label (GET green, POST amber, PUT blue, PATCH purple, DELETE red)
  - [x] Click-away overlay closes dropdown
  - [x] Selecting a method updates store and closes dropdown
- [x] URL input — JetBrains Mono, full-width, no spellcheck
- [x] SEND button — accent background, accent-fg text; shows "SENDING" + reduced opacity while loading
- [x] Resolved URL preview — `↳` prefix + substituted URL with active params appended

### Request Tabs (`components/request/RequestTabs.tsx`)

- [x] Tabs: Params / Headers / Auth / Body
- [x] Active tab: accent underline + fg colour
- [x] Badge count on each tab (active enabled rows; hidden when 0)

### Params Panel (`components/request/ParamsPanel.tsx`)

- [x] List of togglable key-value rows using `KeyValueRow`
- [x] "+ ADD PARAM" dashed button

### Headers Panel (`components/request/HeadersPanel.tsx`)

- [x] Default row: `Accept: application/json`
- [x] List of togglable key-value rows using `KeyValueRow`
- [x] "+ ADD HEADER" dashed button

### Auth Panel (`components/request/AuthPanel.tsx`)

- [x] Sub-tabs: NONE / BEARER / BASIC
  - [x] Active sub-tab: accent background
- [x] None — "No authorization sent with this request."
- [x] Bearer — token input + live preview "→ Authorization: Bearer `<token>`" with var substitution
- [x] Basic — username + password fields side by side

### Body Panel (`components/request/BodyPanel.tsx`)

- [x] "JSON Body" label + BEAUTIFY button
- [x] BEAUTIFY: `JSON.parse` → `JSON.stringify` with 2-space indent; no-op on invalid JSON
- [x] Full-height textarea with focus accent border

### Shared UI (`components/ui/KeyValueRow.tsx`)

- [x] Toggle checkbox (accent when on, transparent when off)
- [x] Key input (accent colour, 40% width)
- [x] Value input (fg colour, flex-1)
- [x] Remove × button with hover fg highlight

---

## Response Viewer

### Response Bar (`components/response/ResponseBar.tsx`)

- [x] "Response" label always visible
- [x] When response exists: status code + text (coloured by range) + time (ms) + size
- [x] Tab bar: BODY / HEADERS / RAW (visible only when response exists)
- [x] Active tab: accent underline

### JSON Viewer (`components/response/JsonViewer.tsx`)

- [x] Auto-pretty-prints valid JSON (2-space indent)
- [x] Two-column grid layout: line numbers (gutter colour) + highlighted code
- [x] Syntax highlighting via `hlLine()`:
  - [x] Object keys — `var(--syn-key)`
  - [x] String values — `var(--syn-str)`
  - [x] Numbers — `var(--syn-num)`
  - [x] Booleans — `var(--syn-bool)`
  - [x] null — `var(--syn-null)`
  - [x] Punctuation `{}[],:` — `var(--syn-punct)`
- [x] Falls back to plain text rendering if JSON parse fails

### Raw Viewer (`components/response/RawViewer.tsx`)

- [x] `<pre>` with word-wrap, JetBrains Mono, fg colour

### Response area states

- [x] **Empty** — centred `↳` icon box + "SEND A REQUEST TO INSPECT THE RESPONSE"
- [x] **Loading** — centred "WAITING..." animation cycling through 4 dot states (220 ms interval)
- [x] **Sandbox note** — amber banner "⚠ Live request blocked by sandbox — showing a sample response"
- [x] **Body tab** — JSON viewer
- [x] **Headers tab** — accent-coloured header names + fg values, one row per header
- [x] **Raw tab** — raw text viewer

---

## Pre-loaded Data

- [x] Default URL: `{{base_url}}/users/1`
- [x] Default body: `{ "title": "big boy", "body": "shipping it", "userId": 1 }`
- [x] Default header: `Accept: application/json`
- [x] DEV env vars: `base_url=https://jsonplaceholder.typicode.com`, `token=dev-7f3a-secret`
- [x] STAGING env vars: `base_url=https://staging.api.bigboy.dev`, `token=stg-9c21-token`
- [x] PROD env vars: `base_url=https://api.bigboy.dev`, `token=` (disabled)

---

## Code Quality (Google TypeScript Style Guide)

- [x] `strict: true` in `tsconfig.json`
- [x] `camelCase` variables/functions, `PascalCase` types/components
- [x] No `any` — all API shapes and store slices fully typed
- [x] Named exports only (default exports only for Next.js page/layout)
- [x] `import type` for type-only imports
- [x] No inline comments except for non-obvious WHY
- [x] `'use client'` directive on all interactive components

---

## Future Enhancements (not yet implemented)

- [ ] **Request tabs** — browser-style multi-tab interface for parallel requests
- [ ] **Code snippet generator** — export current request as curl / fetch / axios
- [ ] **Save to Collections** — persist custom requests alongside JSONPlaceholder presets
- [ ] **OAuth 2.0 auth helper** — additional auth type with token-exchange flow
- [ ] **Response search** — filter/search within response body
- [ ] **Request history persistence** — save history to localStorage across page reloads
- [ ] **Import / Export** — load/save Postman-compatible collection JSON
- [ ] **GraphQL support** — dedicated body mode with schema introspection
- [ ] **WebSocket testing** — persistent connection panel
- [ ] **Keyboard shortcuts** — Ctrl/Cmd+Enter to send, Ctrl/Cmd+K for command palette
