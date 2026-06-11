# Xonos-Lucy

Lucy's always-updating Spotify stats dashboard, a pink edition of
[Xonos](https://github.com/NeilP211/xonos). It shows her listening: top tracks
and artists across 4 weeks / 6 months / 1 year, recently played, and a
listening-pulse heatmap built from a recently-played log that grows over time.

Lucy authenticates once (remotely, from her phone is fine). After that the site
updates itself. No visitor logs in, and no secrets ever reach the browser.

The look is a terminal/brutalist theme: black canvas, a single hot-pink accent
(#ff4fa3), boxy hairline-bordered cards, and Space Grotesk / Inter / JetBrains
Mono typography.

Live: https://neilp211.github.io/xonos-lucy/

## How it works

- A scheduled GitHub Action refreshes a 1-hour Spotify access token from a stored
  refresh token, fetches the data, and writes JSON into `public/data/`.
- The static React site (Vite + Recharts) reads those JSON files. The Action also
  commits the data, so the recently-played log accumulates real history that the
  API alone will not return.

## Local development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm test         # unit tests for genre weighting and export aggregation
```

The site ships with placeholder sample data so it renders before any credentials
are wired up. A banner makes clear when sample data is showing.

## One-time setup

Reuses the existing Xonos Spotify app (same Client ID / Client Secret), so no new
Spotify app is needed. Steps:

1. In the Spotify developer dashboard, open the Xonos app > Users and Access and
   add Lucy's Spotify account email (development mode allows up to 5 users).

2. Get Lucy's refresh token remotely. She does not need the repo or Node:
   ```bash
   # .env (gitignored) holds SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET
   npm run auth:link            # prints a URL; send it to Lucy
   # Lucy logs in, taps Agree, lands on a broken 127.0.0.1 page (expected),
   # and sends back the full URL from her address bar. Then, within a few
   # minutes of her tap:
   npm run auth:code "<the URL she sent back>"
   ```
   The refresh token lands in `.refresh_token` (gitignored).

3. Add the three repository secrets:
   ```bash
   gh secret set SPOTIFY_CLIENT_ID
   gh secret set SPOTIFY_CLIENT_SECRET
   gh secret set SPOTIFY_REFRESH_TOKEN < .refresh_token
   ```

4. Enable GitHub Pages: Settings > Pages > Build and deployment > Source:
   "GitHub Actions".

5. Trigger a run: Actions > update > Run workflow (or wait for the schedule). The
   first authenticated run replaces the sample data with Lucy's real listening.

## Notes and limitations

- Time ranges come from Spotify's API: 4 weeks, 6 months, and 1 year. There is no
  true lifetime view available from the API.
- Spotify strips genres, popularity, and followers from the API for new
  development-mode apps, and deprecated audio-features/recommendations. So there is
  no genre or mood breakdown.
- "Now playing" is best-effort. On a cron-driven static site it usually shows the
  last played track ("last spun").
- Reading Lucy's data does not require her to have Premium; the 2026 development
  mode Premium requirement applies to the app owner (Neil), who already holds it
  for Xonos.
- GitHub Pages on a private repository requires a paid GitHub plan; on a free
  plan the repo must be public for the site to deploy.
