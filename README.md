# ReadLight

**독서 동반자 앱** - 당신의 독서를 함께하는 동반자

[![CI](https://github.com/VoidLight00/readlight/actions/workflows/ci.yml/badge.svg)](https://github.com/VoidLight00/readlight/actions/workflows/ci.yml)

**Live**: [readlight-one.vercel.app](https://readlight-one.vercel.app)

## Quick Start

```bash
git clone https://github.com/VoidLight00/readlight.git
cd readlight
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| State | Zustand (localStorage) |
| AI | Anthropic SDK (optional) |
| OCR | Tesseract.js |
| Charts | Recharts |

## Free APIs (no key required)

| API | Usage | Limit |
|-----|-------|-------|
| [Open Library](https://openlibrary.org/developers/api) | Book covers, search, metadata | Unlimited |
| [Google Books](https://developers.google.com/books) | Book search, autocomplete | 1,000/day |

## Scripts

```bash
npm run dev       # dev server
npm run build     # production build
npm run lint      # ESLint
npm test          # vitest
npm run deploy    # Vercel production deploy
```

## PWA

ReadLight is installable as a PWA. Works offline with localStorage persistence.

## License

MIT
