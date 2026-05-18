# Workout Tracker PWA

A personal gym workout tracker built as a Progressive Web App (PWA), optimized for iPhone Safari.

## Features

- Two training plans: **Plan Trainer** and **Plan Optimiert**
- Set-by-set tracking with weight + reps inputs
- Intelligent feedback after each set (progress, regressions, PRs)
- Rest timer with visual circle countdown and haptic feedback
- Swipe gestures between exercises
- Full training history with session detail view
- Statistics: streak, volume, exercise progress charts, personal records
- Full offline support via Service Worker
- Data export/import as JSON
- Dark/Light mode toggle

## Installation (iPhone)

### Option A: GitHub Pages (recommended)
1. Push all files to a GitHub repository.
2. Go to **Settings → Pages** and set source to `main` branch, root `/`.
3. Open the generated `https://yourusername.github.io/workout-tracker/` URL in iPhone Safari.
4. Tap the **Share** button (box with arrow) → **"Zum Home-Bildschirm"**.
5. The app icon appears on your home screen. Opening it from there runs it fullscreen.

### Option B: Any Web Server
1. Upload all files (`index.html`, `style.css`, `app.js`, `manifest.json`, `service-worker.js`) to any web server with HTTPS.
2. Open the URL in iPhone Safari.
3. Share → "Zum Home-Bildschirm".

### Option C: Local Testing (VS Code)
1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. Open `http://localhost:5500/workout-tracker/` in your browser.
   > Note: PWA features (Service Worker, Add to Home Screen) require HTTPS. For local testing, Chrome DevTools can simulate offline mode.

## File Structure

```
workout-tracker/
├── index.html          # App shell, all HTML structure
├── style.css           # iOS-inspired dark-mode-first stylesheet
├── app.js              # All application logic (vanilla JS)
├── manifest.json       # PWA manifest for home screen install
├── service-worker.js   # Offline caching (cache-first strategy)
└── README.md           # This file
```

## Data

All data is stored in `localStorage` under the key `workout_tracker_data`. No server, no account required.

Use **Settings → Daten exportieren** to back up your data as a JSON file before clearing browser storage.

## Tech Stack

- Vanilla HTML / CSS / JavaScript — no frameworks, no build step
- PWA with Service Worker (offline-first)
- localStorage for persistence
- HTML5 Canvas for charts and confetti
- iOS HIG-compliant touch targets (44×44 px minimum)
