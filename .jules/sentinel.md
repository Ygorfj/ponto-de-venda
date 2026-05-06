## 2024-05-24 - Unsanitized User Input Leading to XSS
**Vulnerability:** Found multiple instances where user input from `prompt()` or form inputs was used directly without sanitization, and then displayed using `.innerHTML`.
**Learning:** Even internal or local-first tools (like this POS system) can be vulnerable to Cross-Site Scripting (XSS) if user input isn't properly sanitized. This is especially risky when input is displayed to other users (e.g., manager names).
**Prevention:** Always sanitize user input before storing it or displaying it via `.innerHTML`, or prefer `.textContent`/`.innerText` over `.innerHTML` when displaying plain text.
## 2026-05-06 - XSS in DOM Manipulation (innerHTML)
**Vulnerability:** XSS vulnerability through usage of `.innerHTML` with unsanitized variables directly sourced from local storage or unvalidated state variables (`m.name`, `data.name`).
**Learning:** In plain HTML/JS applications, avoid directly interpolating variables into `.innerHTML` templates unless strictly sanitized. The `sanitizeInput` function should be used for dynamic text interpolation when raw HTML must be injected via `innerHTML`.
**Prevention:** Standardize string sanitization prior to `.innerHTML` assignments, or preferably use `.textContent` or `.innerText` where dynamic values do not contain HTML elements.
