# Arena — Real-time Multiplayer Browser Game

A top-down real-time multiplayer arena game built with React, TypeScript, and WebSockets. Players join a shared 2000x2000 world, move freely, attack each other, gain XP, and level up. The game canvas runs at 60 fps via a dedicated `requestAnimationFrame` loop fully decoupled from React's render cycle.

**Live site:** [https://module-9-react.vercel.app/](https://module-9-react.vercel.app/)

---

## Features

- Real-time multiplayer over WebSocket with per-message deflate compression
- Diff-based state updates — the server only sends what changed each tick
- Animated sword-swing attack with directional arc
- Bob animation while moving for all players
- Character selection (Golem, Knight, Rogue) with sprite support
- Skin customization
- HP, XP and level system with game-over on death
- Map boundary lines and scrolling dot-grid background
- Sound effects for attacks and hits (Web Audio API, zero-latency)
- 60 fps canvas rendering via rAF, independent of React state

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file at the project root (or edit the existing one):

```env
VITE_SERVER_LINK=https://homework-hs.site   # WebSocket server base URL
VITE_SPRITES=false                           # Set to "true" to render character sprites instead of circles
BASE_URL=                                    # Optional base path for deployment
```

---

## Scripts

| Script | Command | Description |
|---|---|---|
| **dev** | `npm run dev` | Start the Vite dev server with HMR at `http://localhost:5173` |
| **build** | `npm run build` | Type-check with `tsc` then bundle for production into `dist/` |
| **preview** | `npm run preview` | Serve the production build locally to verify before deploying |
| **test** | `npm test` | Run the test suite with Vitest |
| **lint** | `npm run lint` | Run ESLint across all source files |
| **lint-fix** | `npm run lint-fix` | Run ESLint and auto-fix fixable issues |
| **format-detect** | `npm run format-detect` | Check formatting with Prettier without writing |
| **format-fix** | `npm run format-fix` | Auto-format all files with Prettier |

---

## How to Play

1. Open the live site or run `npm run dev`
2. Go to **Settings** to choose your character and skin
3. Click **Play**, enter a name, and click **Join**
4. Move with `WASD` or arrow keys
5. Click anywhere on the canvas to swing your sword in that direction
6. Deal damage to other players to gain XP and level up
7. If your HP reaches 0 you are disconnected — rejoin to play again

---

## Project Structure

```
src/
├── Game/               # Game canvas, hooks, and rendering utilities
│   ├── hooks/          # useCanvasRenderer, useAttackAnimation, useSoundEffects, ...
│   └── utils/          # renderPlayer, renderAttack, renderGrid, renderMapBounds
├── MainMenu/           # Home screen, settings, character and skin selectors
├── shared/
│   ├── components/     # Button, Box, ErrorComponent, LoadingComponent
│   ├── services/       # WebSocket client and Zod message schemas
│   └── stores/         # Zustand stores (game state, settings)
└── routes.tsx          # React Router route definitions
```

## Routes

| Path | Page |
|---|---|
| `/` | Main menu |
| `/play` | Game |
| `/settings` | Character and skin selector |
| `/achivements` | Achievements *(coming soon)* |
| `/game-over` | Game over screen *(coming soon)* |
