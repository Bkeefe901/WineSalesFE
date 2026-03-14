# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

There is no test suite configured.

## Architecture

React 19 SPA built with Vite. Two routes: `/` (auth) and `/dash` (protected dashboard).

**Entry point**: `src/main.jsx` → wraps app in `AppProvider` + `BrowserRouter`

**State**: React Context only — no Redux/Zustand.
- `AuthContext` (`src/context/authContext/`) — auth state, login/signUp/logout methods, token stored in cookies via `react-cookie`
- `UserContext` (`src/context/userContext/`) — current user data
- `AppProvider` (`src/context/AppProvider.jsx`) — composes both providers with `CookiesProvider`

**API layer**: `src/utilities/apiService.mjs` — all Axios calls centralized here. Base URL from `VITE_API_URL` env var (`https://winesalesbe.onrender.com/api`). Auth via `x-auth-token` header passed to each function.

**Route protection**: `ProtectedRoutes` component checks `cookies.token`; redirects to `/` if absent.

**Styling**: CSS Modules (`.module.css`) with vanilla CSS. Global theme variables in `src/index.css` (dark blue/brown palette). No CSS framework.

## Key Patterns

- API functions in `apiService.mjs` accept `token` as a parameter — callers pull it from `useCookies`
- `App.jsx` fetches user data on mount/token change via `useEffect` and sets `UserContext`
- Components are in `src/components/`, page-level views in `src/pages/`
- ESLint allows unused vars prefixed with uppercase or `_`
