# The Movie Tracker

A Next.js application for tracking movies and TV shows with a global search functionality.

## Features

- **Global Header**: Search input is available on all pages through a shared header component
- **Zustand Store**: Centralized state management for search functionality and app configuration
- **Search Functionality**: Real-time search with debouncing and modal results
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Built-in dark mode styling

## Architecture

### Global Header

The header component (`components/header.tsx`) is included in the root layout (`app/layout.tsx`) and provides:

- Search input with real-time search
- Clear search functionality
- Focus/blur handling
- Integration with Zustand store

### Zustand Store

The store (`store/useStore.ts`) manages:

- Search state (query, results, loading)
- Modal visibility
- Input focus state
- Default page configuration
- Search handlers with debouncing

### Search Flow

1. User types in the search input
2. Input is debounced (400ms delay)
3. API call is made to TMDB
4. Results are stored in Zustand store
5. Modal shows filtered results
6. User can click on results to navigate

## Pages

- **Home** (`/`): Main dashboard with trending movies and filtering tabs
- **Movie Details** (`/movie/[id]`): Individual movie/show details
- **Profile** (`/profile`): User profile page
- **Login** (`/login`): Authentication page
- **Signup** (`/signup`): Registration page

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```env
NEXT_PUBLIC_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# InstantDB (server key must NOT be exposed to client)
INSTANTDB_ADMIN_KEY=...
```

3. Run the development server:

```bash
npm run dev
```

## Store Configuration

The Zustand store can be configured to set default pages and other app-wide settings:

```typescript
import { useAppStore } from "@/store/useStore";

const { setDefaultPage, defaultPage } = useAppStore();

// Set default page
setDefaultPage("/movie/123");

// Navigate to default page
navigateToDefault();
```

## Search Functionality

The search is handled entirely through the Zustand store:

- Debounced API calls (400ms)
- Error handling
- Loading states
- Result filtering
- Modal management

Built with ❤️ by Zamin Mirzad

## Bookmarks persistence

- Stored in InstantDB via server-side API and mirrored in localStorage for offline UX.
- API: `GET/POST/DELETE /api/bookmarks` (uses Clerk auth server-side).
- Client: optimistic updates; hydrates on sign-in.
