<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Movie Night

This is a Vite + React movie browsing app.

## Project structure

The app is now grouped by responsibility so collaborators can find things quickly:

```text
src/
  components/
    common/      shared UI pieces
    layout/      app shell pieces like the header
    movies/      movie-specific sections and modal UI
  hooks/         reusable page logic
  pages/
    home/        route/page-level screen composition
  services/      API and data helpers
```

## Run locally

1. Install dependencies with `npm install`
2. Add your TMDB credentials to `.env.local` if you want to override the demo fallback values
3. Start the app with `npm run dev`
