# Datalogos Limited corporate website

Responsive semantic single-page corporate site covering Datalogos, AIdentity advisory, Counterpoise, Verity and **Datafolio**. The visual system follows the September 2026 Master Brand Identity: Aptos-style typography, navy/ivory/bronze parent palette, teal advisory and product accents, generous whitespace and direct, evidence-aware language.

## Run locally

Open `index.html` in a browser, or from this directory run:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Files

- `index.html` — page structure, content, metadata and accessible form
- `styles.css` — responsive visual system and mobile layouts
- `app.js` — navigation, sample blog feed and enterprise-email validation
- `backend/` — example Express/MySQL endpoint and schema

## Blog/library feed

The blog cards are rendered from the `posts` array in `app.js`. Replace this sample array with a CMS response or JSON endpoint when publishing. Keep the library documents behind server-side authorization; do not expose private Drive links in front-end code.

## Gated library integration

The browser checks that full name, company and a syntactically valid work email are present. It gives immediate feedback if the email domain is a common personal provider. This is a usability check, not identity verification. `window.DATALOGOS_LIBRARY_ENDPOINT` is intentionally unset: until a secured endpoint is configured, the form clearly says requests are not transmitted.

The `backend/` example shows how a separate service can validate and parse the request, store it in MySQL using parameterised statements, apply rate limits and provide an administrator-controlled approval step. GitHub Pages is static hosting and cannot run a server-side script or securely connect to MySQL. Host the API on a serverless function or application host, configure HTTPS, secrets and allowed origins, then set `window.DATALOGOS_LIBRARY_ENDPOINT` to its public endpoint. Only return protected downloads after authorization; do not treat a submitted email address as authentication.

## Production checks

- Replace sample blog cards with approved articles and images.
- Connect contact links to a monitored inbox/CRM.
- Verify the displayed company details and phone number before launch.
- Add final logo vector files and social sharing metadata.
- Configure consent/privacy notices and retention rules for library requests.
- Use server-side validation, spam protection, rate limiting and CSRF/origin controls for the live form.
