# HornTrax PWA (GitHub Pages)

A fast, installable PWA that works in any modern browser and talks to your existing API.

**API Base (default):** `https://horntrax-api.herokuapp.com`

## Local dev
```bash
npm install
npm run dev
```

## Configure API base
For local dev, create `.env`:
```bash
VITE_API_BASE=https://horntrax-api.herokuapp.com
```

For GitHub Pages, add a Repo Variable:
- Settings → Secrets and variables → Actions → **Variables**
- Add `VITE_API_BASE` = `https://horntrax-api.herokuapp.com`

## Deploy to GitHub Pages
1. Push to `main`
2. In GitHub repo settings:
   - Pages → Source: **GitHub Actions**
3. Workflow will deploy automatically.

## Notes
- Uses `HashRouter` so refresh/deep links work on GitHub Pages.
- Barcode scanning uses the browser `BarcodeDetector` API when available; otherwise it falls back to manual entry.
- QR Export creates a PDF of the currently filtered list (per-user).
