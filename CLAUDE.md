@AGENTS.md

# Prompt Log — BigBoy API Client

บันทึก prompt สำคัญที่ใช้ระหว่างพัฒนา พร้อมเหตุผลที่เขียนแบบนั้น

---

## Prompt 1 — Scaffold Zustand Store

**Prompt ที่ใช้:**

> สร้าง `store/appStore.ts` ด้วย Zustand 5 (ไม่ใช้ deprecated `create<T>()()` pattern)
> TypeScript strict mode, Google TypeScript Style Guide, no `any`.
>
> State shape:
> - `theme`, `method`, `url`, `reqTab`, `sideTab`, `respTab` (enums จาก types/index.ts)
> - `params`, `headers`: `KeyValueRow[]` พร้อม CRUD actions ครบ (update/toggle/remove/add)
> - `auth`: `{ type, token, user, pass }`
> - `envVars`: `Record<string, EnvVar[]>` — แยก scope per-env
> - `history`: `HistoryEntry[]` capped ที่ 40 entries (slice ทิ้ง oldest)
> - `response`: `ApiResponse | null`, `loading`, `loadingTick`
>
> Export `interface AppState` และ `AppActions` แยกกัน ไม่รวม type เดียว

**ทำไมถึงเขียนแบบนี้:**

ต้องระบุ "Zustand 5" ชัดเจน เพราะ API เปลี่ยนจาก v4 — ถ้าไม่บอก version Claude จะใช้ pattern เก่า (`create<T>()()`) ที่ deprecated และ TypeScript strict จะ error ต้องระบุ `no any` เพราะ action type ใน CRUD (`updateParam`, `updateHeader`) ถ้าไม่บอก จะได้ `any` แทน union `'key' | 'value'` ซึ่งทำให้ strict mode ไม่ผ่าน

---

## Prompt 2 — CORS Proxy Route Handler

**Prompt ที่ใช้:**

> สร้าง `app/api/proxy/route.ts` เป็น Next.js Route Handler (App Router)
> รับ request ทุก method: GET / POST / PUT / PATCH / DELETE
> Forward ไปยัง URL ที่ระบุใน request header ชื่อ `x-proxy-url`
>
> ต้องทำ:
> - Strip hop-by-hop headers ออกก่อน forward (connection, keep-alive, transfer-encoding,
>   content-encoding, content-length, host, upgrade, te, trailers, accept-encoding)
> - ถ้าไม่มี `x-proxy-url` → return 400 + JSON error
> - ถ้า upstream fetch throw → return 502 + error message จาก err.message
> - Return response body/status/statusText ของ upstream ตรงๆ ไม่แก้ไข
> - Export named: `GET`, `POST`, `PUT`, `PATCH`, `DELETE` ชี้ไปที่ฟังก์ชันเดียว

**ทำไมถึงเขียนแบบนี้:**

ต้องระบุ "Strip hop-by-hop headers" ครบชุด — ถ้าไม่บอก Claude จะ forward `content-encoding: gzip` และ `transfer-encoding: chunked` ไปด้วย แต่ Node.js fetch ของ Next.js decompress body อัตโนมัติแล้ว browser จะพยายาม decompress ซ้ำและได้ response เสีย ระบุ 400/502 ชัดเจนเพื่อให้ debug ได้ตรงจุดตอน development

---

## Prompt 3 — Environment Variable Interpolation

**Prompt ที่ใช้:**

> สร้าง `lib/envInterpolation.ts`
> ฟังก์ชัน `subst(str: string, vars: EnvVar[]): string`
>
> Spec:
> - แทนที่ `{{variable}}` ด้วยค่าจาก vars[] ที่ `on === true` และ `key` ไม่ว่างเท่านั้น
> - รองรับ whitespace ใน braces: `{{ base_url }}` เทียบเท่า `{{base_url}}`
> - ถ้าไม่พบ key ที่ match → คืน placeholder เดิม (`{{variable}}`) ไม่ใช่ empty string
> - regex ต้องรองรับ key ที่มี dot และ dash ได้ เช่น `{{api.base-url}}`
> - รับ `null`/`undefined` เป็น str ได้โดยไม่ throw (coerce เป็น string)

**ทำไมถึงเขียนแบบนี้:**

"คืนค่าเดิมถ้าไม่พบ" เป็น spec ที่ต้องบอกชัด ถ้าไม่บอก Claude จะ replace ด้วย empty string ซึ่งทำให้ URL กลายเป็น `https:///users/1` โดยที่ user ไม่รู้ว่า env var หายไปไหน การคืน `{{variable}}` ไว้ทำให้ `useApiRequest` ตรวจพบได้ว่ายัง unresolved และ show error ก่อน fetch

---

## Prompt 4 — useApiRequest Hook พร้อม Error Handling ครบ

**Prompt ที่ใช้:**

> สร้าง `hooks/useApiRequest.ts` เป็น `'use client'` custom hook
>
> Flow:
> 1. `buildUrl(url, params, vars)` → ตรวจ `{{...}}` ที่ยังเหลือ → `setResponse` error แล้ว return ถ้าพบ
> 2. ตรวจ URL ต้องขึ้นต้น `http://` หรือ `https://` → `setResponse` error ถ้าไม่ผ่าน
> 3. `setLoading(true)`, `setResponse(null)`, `closeMenus()`
> 4. เริ่ม `setInterval` tick ทุก 220ms สำหรับ loading animation (clear ใน `finally` เสมอ)
> 5. วัดเวลาด้วย `performance.now()` ไม่ใช่ `Date.now()`
> 6. `fetch('/api/proxy', { ...opts, headers: { ...resolvedHeaders, 'x-proxy-url': resolvedUrl } })`
> 7. อ่าน response body ด้วย `res.text()` คำนวณ size จาก `new Blob([text]).size`
> 8. `pushHistory(entry)` หลัง fetch สำเร็จ
> 9. catch: ถ้า message มี "failed to fetch" หรือ "network" → note ว่า proxy server อาจไม่รัน

**ทำไมถึงเขียนแบบนี้:**

ระบุ `performance.now()` เพราะวัด elapsed time ได้แม่นกว่า `Date.now()` (ไม่กระโดดเมื่อ system clock เปลี่ยน) ระบุ "clear ใน `finally` เสมอ" เพราะถ้า interval ไม่ถูก clear จะ leak และ call `setState` หลัง component unmount ทำให้ React warning ระบุ error message เรื่อง proxy ชัดเจนเพราะ "failed to fetch" เป็น error ที่ debug ยากที่สุดสำหรับ developer ที่ลืม run `npm run dev`

---

## Prompt 5 — Unit Tests พร้อม Edge Cases

**Prompt ที่ใช้:**

> เขียน Jest tests สำหรับ `lib/httpClient.ts` ใน `__tests__/lib/httpClient.test.ts`
> TypeScript strict, ไม่ mock ฟังก์ชันใน lib เดียวกัน
>
> `buildUrl()` — ต้องครอบคลุม:
> - Happy path: URL + active params → querystring ถูกต้อง
> - param ที่ `on === false` → ไม่รวมใน querystring
> - param ที่ `key === ''` → ไม่รวม (edge case ที่ลืมบ่อย)
> - URL มี `?` อยู่แล้ว → ต่อด้วย `&` ไม่ใช่ `?`
> - `{{variable}}` ใน param value → interpolate ได้ก่อน encode
>
> `buildHeaders()` — ต้องครอบคลุม:
> - Bearer token → `Authorization: Bearer xxx`
> - Basic auth → `btoa("user:pass")` encode ถูกต้อง
> - method POST + body มีค่า + ไม่มี Content-Type → inject `application/json` อัตโนมัติ
> - method GET + body มีค่า → ไม่ inject Content-Type (GET ไม่มี body)
> - Content-Type ที่ user set เอง → ไม่ถูก override

**ทำไมถึงเขียนแบบนี้:**

ระบุ edge case `key === ''` ชัดเจนในใน prompt — ถ้าปล่อยให้ Claude เขียน tests เองโดยไม่บอก จะเน้น happy path ทั้งหมด bug ที่ param key ว่างแล้วได้ `?=value` ใน URL จะไม่ถูกจับ ระบุ "URL มี `?` อยู่แล้ว" เพราะเป็น bug ที่พบจริงระหว่าง test: URL เช่น `https://api.example.com/search?q=foo` จะได้ `?q=foo?page=1` แทน `?q=foo&page=1`

---

## Prompt 6 — Security Analysis + Generate HTML Report

**Prompt ที่ใช้:**

> วิเคราะห์ความปลอดภัยของ bigboy-project ทั้งหมด แล้ว generate `security-report.html`
>
> ให้ตรวจ:
> - SSRF ใน `/api/proxy` (ไม่มี URL allowlist/blocklist)
> - XSS ใน JsonViewer (render HTML ที่มาจาก API response หรือไม่)
> - Header injection (user input → HTTP headers)
> - Sensitive data ใน localStorage หรือ Zustand state ที่ persist
> - Dependency vulnerabilities (`npm audit`)
>
> Format HTML:
> - Summary bar แสดงจำนวน Critical / High / Medium / Low
> - แต่ละ finding มี: ชื่อ, severity badge, สาเหตุ, วิธีแก้ไขที่แนะนำ
> - สรุปภาพรวมท้ายรายงาน: โปรเจคปลอดภัยระดับใด

**ทำไมถึงเขียนแบบนี้:**

ระบุ attack vector ที่ต้องตรวจชัดเจน (SSRF, XSS, header injection) แทนที่จะบอกแค่ "ตรวจ security" เพราะถ้าไม่บอก Claude จะตรวจแบบ generic และพลาด SSRF ใน proxy ซึ่งเป็น risk จริงของโปรเจคนี้ ระบุ format HTML ให้ครบเพราะ security report ที่อ่านไม่รู้เรื่องไม่มีประโยชน์
