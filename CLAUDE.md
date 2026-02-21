# CLAUDE.md

This file provides guidance for AI assistants working with the **Planetky** repository.

## Project Overview

**Planetky** is an interactive children's educational web application set in space. Children navigate a universe by flying rockets between planets, each planet offering a different personal development activity. The app is in **Czech language**.

### Core Concept
- A space universe with stars, planets, and rockets
- Two rocket types: one for girls, one for boys (expandable to more types)
- 8 planets, each containing a unique educational/motivational activity
- Target audience: children (approx. 8-15 years old)

### The 8 Planets

1. **Kartičky (Cards)** - Morning and evening motivational card draws from two decks
2. **Nástěnka snů (Dream Board)** - Vision board with goals by timeframe + completed dreams
3. **Vytvoř si předmět (Create Your Subject)** - Design your own school subject
4. **Antistresová planeta (Anti-stress)** - Sub-planets: meditation, breathing (4s in/6s out), affirmations, joy cards, talisman creator
5. **Budoucí já (Future Self)** - Create a 30-year-old avatar, space diary for self-advice
6. **Vynálezy a nápady (Inventions)** - Guided questionnaire for product/service/invention ideas
7. **Planeta darování (Giving)** - Plan giving, volunteering, and helping others
8. **Malí Hrdinové (Little Heroes)** - Personality types: Sangvinik (Mickey Mouse), Cholerik (Stitch), Flegmatik (Sonic), Melancholik (Wednesday Addams)

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build tool**: Vite
- **Styling**: CSS Modules with space theme
- **State management**: React Context + useReducer
- **Persistence**: localStorage (client-side)
- **Animations**: CSS animations + requestAnimationFrame for space effects
- **No backend required** - all data stored locally in the browser

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Project Structure

```
planetky/
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── public/
│   └── assets/           # Static images, sounds
└── src/
    ├── main.tsx           # App entry point
    ├── App.tsx            # Root component with routing
    ├── index.css          # Global styles + space theme
    ├── types/             # Shared TypeScript types
    │   └── index.ts
    ├── hooks/             # Custom React hooks
    │   └── useLocalStorage.ts
    ├── context/           # React Context providers
    │   └── AppContext.tsx
    ├── components/        # Shared UI components
    │   ├── Universe/      # Space background, stars, navigation
    │   ├── Rocket/        # Rocket selection and animation
    │   └── common/        # Buttons, cards, modals
    └── planets/           # One folder per planet
        ├── P1_Cards/
        ├── P2_DreamBoard/
        ├── P3_CreateSubject/
        ├── P4_AntiStress/
        ├── P5_FutureSelf/
        ├── P6_Inventions/
        ├── P7_Giving/
        └── P8_LittleHeroes/
```

## Development Guidelines

### Language & Localization
- All user-facing text is in **Czech**
- Component names and code are in **English**
- Comments may be in English

### Branch Workflow
- Development branches follow the pattern `claude/<description>`
- Write clear, descriptive commit messages

### Code Conventions
- Functional components with hooks (no class components)
- Each planet is a self-contained module in `src/planets/`
- Shared logic goes in `src/hooks/` or `src/context/`
- Use CSS Modules (`*.module.css`) for component-scoped styles
- Space theme colors: deep blues, purples, with bright accent colors per planet
- Child-friendly UI: large touch targets, playful animations, clear icons

### Data Persistence
- All user data is saved to `localStorage` under namespaced keys
- Key pattern: `planetky_<planet>_<dataType>` (e.g., `planetky_dreamboard_goals`)
- Data is JSON-serialized

## Key Files

| Path | Purpose |
|------|---------|
| `CLAUDE.md` | AI assistant guidance (this file) |
| `src/App.tsx` | Root component, routing between universe and planets |
| `src/components/Universe/` | Main space navigation screen |
| `src/planets/` | Individual planet implementations |
| `src/context/AppContext.tsx` | Global app state (selected rocket, user profile) |
| `src/types/index.ts` | Shared TypeScript interfaces |
