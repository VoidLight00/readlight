# ReadLight

독서 동반자 앱. Next.js 16 + TypeScript + Tailwind + shadcn/ui.

## Architecture
See AGENTS.md for layer rules. Key rule: UI never imports from lib/ai/ directly.

```
app/            → Pages & layouts (Next.js App Router)
components/     → UI components (shadcn/ui in components/ui/)
lib/
  ai/           → Anthropic SDK (isolated layer)
  books/        → Book services (Open Library, Google Books)
  stores/       → Zustand stores
public/         → Static assets, PWA icons
```

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm test` — vitest
- `npm run lint` — eslint
- `npm run deploy` — Vercel production deploy

## Stack
- State: Zustand with localStorage persistence
- AI: Anthropic SDK (lib/ai/ only)
- OCR: Tesseract.js
- UI: shadcn/ui components in components/ui/

## Deployment
- GitHub: https://github.com/VoidLight00/readlight
- CI: GitHub Actions (.github/workflows/ci.yml)
- Hosting: Vercel — https://readlight-one.vercel.app (auto-deploy on push to main)

## APIs (free, no key)
- Open Library: covers, search, book metadata
- Google Books: search, autocomplete (1000/day)

## Environment Variables
- `ANTHROPIC_API_KEY` — optional, for AI features only
