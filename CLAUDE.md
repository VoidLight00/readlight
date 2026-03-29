# ReadLight

독서 동반자 앱. Next.js 14 + TypeScript + Tailwind + shadcn/ui.

## Architecture
See AGENTS.md for layer rules. Key rule: UI never imports from lib/ai/ directly.

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm test` — vitest
- `npm run lint` — eslint

## Stack
- State: Zustand with localStorage persistence
- AI: Anthropic SDK (lib/ai/ only)
- OCR: Tesseract.js
- UI: shadcn/ui components in components/ui/
