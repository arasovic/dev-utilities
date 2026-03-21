# dev-utilities

Offline-first developer toolkit. 10 tools, single page, dark mode, zero backend.

Built with Svelte 4 + Vite. No frameworks, no APIs, no tracking. Everything runs in your browser.

## Tools

- **JSON Formatter** — format, validate, minify
- **Base64** — encode / decode
- **URL Encoder** — encode / decode URI components
- **UUID Generator** — v4 UUIDs
- **Hash Calculator** — SHA-1, SHA-256, SHA-512, MD5
- **JWT Decoder** — decode header + payload, check expiry
- **Color Converter** — HEX, RGB, HSL
- **Timestamp Converter** — unix ↔ human-readable
- **Regex Tester** — live matching with capture groups
- **Lorem Ipsum** — paragraph / sentence / word generator

## Run locally

```bash
git clone https://github.com/ArasMehmet/dev-utilities.git
cd dev-utilities
npm install
npm run dev
```

## Stack

Svelte 4, Vite, plain CSS, Web Crypto API. No runtime dependencies beyond Svelte itself.

## License

MIT
