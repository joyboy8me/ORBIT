# Orbit

Orbit is a local-first productivity workspace and Chrome New Tab extension.

## What is Orbit?

Orbit turns each new Chrome tab into a customizable personal workspace. It puts
the tools you use to plan, focus, and keep momentum in one dashboard, while
keeping your workspace data in your local browser profile.

Start from the lightweight launch screen, then open the dashboard to arrange
the widgets around the way you work. Orbit is designed for an individual
browser profile: it has no account, server-side workspace, or automatic
cross-device synchronization.

## Features

- **Customizable dashboard:** drag and resize widgets, choose which ones are
  visible, and reset the layout whenever needed.
- **Focus tools:** use a focus timer, manage time-boxing groups and subtasks,
  and track activity streaks.
- **Everyday planning:** keep a notepad/task list, save important links in
  categorized tabs, and add quick-launch shortcuts.
- **At-a-glance utilities:** view the clock and optional weather, set a water
  goal and reminders, and configure notification sounds where supported.
- **Music and ambience:** play built-in lofi radio stations or use configured
  YouTube and Spotify links in the Song Player.
- **Personal appearance:** select from the Default Glass, Manga, Cyberpunk,
  and CLI Terminal themes; customize accent colors, typography, font size, and
  wallpapers (including your own images or videos).
- **Local-first storage:** settings, widgets, tasks, routines, and activity
  data are saved in browser-local storage rather than an Orbit backend.

## How it works

When installed as a Chrome extension, Orbit replaces Chrome's New Tab page.
The extension stores workspace preferences and data with `chrome.storage.local`
(and uses `localStorage` as a fallback outside the extension). Optional
features such as weather, media, fonts, and links connect directly to their
respective third-party services only when used or configured. See
[PRIVACY.md](PRIVACY.md) for the complete privacy notice.

## Use Orbit locally

### Prerequisites

- Google Chrome (or another Chromium-based browser with extension support)
- Node.js 20 or later, which includes npm

### Run the website locally

Clone the repository, open a terminal in the project folder, and install the
dependencies:

```bash
git clone <repository-url>
cd Orbit
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The
public privacy notice is also available locally at `/privacy`.

### Install the New Tab extension locally

Build the extension:

```bash
npm run build
```

Then in Chrome:

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Select **Load unpacked**.
4. Choose this project's `dist` folder.
5. Open a new tab to use Orbit.

After making changes, run `npm run build` again and select the reload button on
the Orbit card in `chrome://extensions`.

## Production build

```bash
npm ci
npm run check
```

The deployable extension is written to `dist/`. Load that folder in Chrome via
`chrome://extensions` → Developer mode → Load unpacked.

## Privacy and data

Orbit stores settings, tasks, routines, and activity data locally in the browser
(Chrome extension storage, with a localStorage fallback). It has no account,
backend, telemetry, or cloud synchronization. Optional weather, media, fonts,
and user-configured links contact their respective third-party services.

## Support scope

Orbit is designed for one browser profile at a time. Data is not shared between
people or automatically synchronized across devices; export/backup should be
provided before relying on it for important records.
