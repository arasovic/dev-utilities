# dev-utilities

Offline-first developer toolkit. 10 tools, file-based routing, dark mode, zero backend.

Built with SvelteKit + adapter-static. No runtime APIs, no tracking. Everything runs in your browser with static site generation.

## Tools

Each tool has its own route:

- **/json** — JSON Formatter (format, validate, minify)
- **/base64** — Base64 encode / decode
- **/url** — URL Encoder (encode / decode URI components)
- **/uuid** — UUID Generator (v4 UUIDs)
- **/hash** — Hash Calculator (SHA-1, SHA-256, SHA-512, MD5)
- **/jwt** — JWT Decoder (decode header + payload, check expiry)
- **/color** — Color Converter (HEX, RGB, HSL)
- **/timestamp** — Timestamp Converter (unix ↔ human-readable)
- **/regex** — Regex Tester (live matching with capture groups)
- **/lorem** — Lorem Ipsum (paragraph / sentence / word generator)

## Run locally

```bash
git clone https://github.com/arasovic/dev-utilities.git
cd dev-utilities
npm install
npm run dev
```

## Build

Generate static site for production:

```bash
npm run build
```

Output is in `build/` directory, ready for static hosting.

## Stack

SvelteKit, adapter-static, Lucide Icons, plain CSS, Web Crypto API. Static site generation with SEO features (meta tags, sitemap, robots.txt, structured data).

## License

MIT
