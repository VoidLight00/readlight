# ReadLight — Agent Rules

## Quick Start
ReadLight is a reading companion app. Dark-mode-first, Korean UI, mobile-first.

## Architecture Layers (STRICTLY ENFORCED)
```
Layer 1: UI       → app/, components/ui/, components/
Layer 2: Domain   → lib/reading/, lib/books/
Layer 3: AI       → lib/ai/         (ONLY place that calls Claude API)
Layer 4: Storage  → lib/storage/    (localStorage, Obsidian export)
```

### Import Rules
- Layer 1 (UI) NEVER imports from Layer 3 (AI) directly
- Layer 2 (Domain) orchestrates between layers
- Layer 3 (AI) has no knowledge of UI or Storage
- Layer 4 (Storage) is a pure data layer

### Dependency Direction
```
UI → Domain → AI
UI → Domain → Storage
```

## File Conventions
- Components: PascalCase (BookCard.tsx)
- Lib modules: camelCase directories, named exports
- Types: types/index.ts — single source of truth
- Pages: app/[route]/page.tsx (Next.js App Router)

## Testing
- Framework: Vitest + @testing-library/react
- Run: `npm test`
- Coverage threshold: 80%
- Domain logic (lib/) MUST have unit tests
- UI components: test user interactions, not implementation

## Design Tokens
- Background: #0A0A0A | Card: #1A1A1A | Border: #2A2A2A
- Text: #FFFFFF / #CCCCCC | Accent: #F5A623 (orange)
- Min touch target: 44px | Mobile-first
- All UI text in Korean

## State Management
- Zustand stores in lib/ directories
- localStorage persistence via Zustand middleware
- No prop drilling — use stores directly in components

## AI Integration
- Claude API calls ONLY in lib/ai/
- Always handle missing API key gracefully (hide AI features)
- Never block UI on AI responses

## Key Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm test             # Run tests
npm run lint         # ESLint check
bash scripts/gc.sh   # Anti-pattern scan
```
