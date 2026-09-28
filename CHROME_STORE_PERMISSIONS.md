# Orbit — Chrome Extension Permissions Reference

This document provides factual justification for every permission and host permission
declared in `public/manifest.json`. All justifications are grounded in the actual
implementation in the source code.

---

## Standard Permissions

| Permission | Reason |
|---|---|
| `storage` | Reads and writes all user settings (widgets, theme, wallpaper, tasks, routines, etc.) via `chrome.storage.local`. Implemented in `src/utils/storage.js`. |
| `unlimitedStorage` | User wallpapers (uploaded images/videos) are stored as data URLs in `chrome.storage.local`. These can be large (up to 20 MB per file). `unlimitedStorage` prevents the default 5 MB quota limit from silently failing. |
| `declarativeNetRequest` | Modifies `Referer` and `Origin` request headers for YouTube and YouTube-nocookie requests so that YouTube embedded iframes load correctly from the extension context. Rules are declared statically in `public/rules.json`. |

---

## Host Permissions

### `https://*.youtube.com/*`

**Reason:** YouTube video and playlist embeds are displayed in the SongPlayer widget (via `<iframe>`). The user can also paste YouTube URLs which are parsed by `src/utils/youtube.js`. The `declarativeNetRequest` rule also targets `youtube.com` to set correct request headers.

**Where used:**
- `src/components/SongPlayer.jsx` — iframe embed rendering
- `src/utils/youtube.js` — URL parsing for video and playlist IDs
- `public/rules.json` — `declarativeNetRequest` rule condition

---

### `https://*.youtube-nocookie.com/*`

**Reason:** Chrome extensions may serve YouTube embeds using the privacy-enhanced `youtube-nocookie.com` domain. The `declarativeNetRequest` rule covers this domain, and it is explicitly listed in `content_security_policy.frame-src` to allow iframe embedding.

**Where used:**
- `public/rules.json` — `declarativeNetRequest` rule condition (rule ID 2)
- `public/manifest.json` — `content_security_policy.frame-src`

---

### `https://*.googlevideo.com/*`

**Reason:** `googlevideo.com` is the CDN used by YouTube to deliver media content. Chrome requires this host permission for YouTube-embedded media to load successfully in extensions, even when the iframe src is `youtube.com`.

**Where used:**
- Required by Chrome for YouTube iframe media delivery (transitive dependency of `youtube.com` embeds)
- `public/manifest.json` — `content_security_policy` (implicitly via `media-src https:`)

---

### `https://noembed.com/*`

**Reason:** Listed in `content_security_policy.connect-src` as a permitted oEmbed metadata endpoint. Present for forward compatibility with potential YouTube thumbnail or title lookups via the noembed.com API.

**Where used:**
- `public/manifest.json` — `content_security_policy.connect-src`

---

### `https://music.youtube.com/*`

**Reason:** YouTube Music URLs are a supported input format in the SongPlayer widget. Users can paste YouTube Music playlist or track links, which are parsed by `src/utils/youtube.js`.

**Where used:**
- `src/utils/youtube.js` — `extractVideoId` and `extractPlaylistId` handle `music.youtube.com` URL patterns
- `public/manifest.json` — `content_security_policy.connect-src` and `frame-src`

---

### `https://api.open-meteo.com/*`

**Reason:** The Clock widget optionally displays current weather conditions. When the user grants browser geolocation permission, it fetches current weather data from the open-meteo.com free weather API.

**Where used:**
- `src/components/Clock.jsx` line 31 — `fetch("https://api.open-meteo.com/v1/forecast?...")`

---

### `https://*.spotify.com/*`

**Reason:** Users can optionally configure a Spotify playlist or track URL in the SongPlayer widget. The URL is parsed by `src/utils/spotify.js` and rendered as a Spotify `open.spotify.com/embed/...` iframe. This covers both `open.spotify.com` (embed URL) and the broader `*.spotify.com` pattern used in CSP.

**Where used:**
- `src/utils/spotify.js` — `extractSpotifyEmbedUrl`, `isSpotifyUrl`
- `src/components/DashboardGrid.jsx` / `SongPlayer.jsx` — iframe rendering
- `public/manifest.json` — `content_security_policy.frame-src` and `connect-src`

---

### `https://streams.ilovemusic.de/*`

**Reason:** One of the default 24/7 lofi radio stations in the SongPlayer widget streams audio from `streams.ilovemusic.de`. The stream URL is `https://streams.ilovemusic.de/...` and is played via an HTML5 `<audio>` element.

**Where used:**
- `src/App.jsx` — `DEFAULT_LOFI_STATIONS` array, station "Lofi Study Lounge 24/7"

---

### `https://*.zeno.fm/*`

**Reason:** Three of the default 24/7 lofi radio stations stream audio from `stream.zeno.fm`. Played via HTML5 `<audio>`.

**Where used:**
- `src/App.jsx` — `DEFAULT_LOFI_STATIONS` array:
  - "Lofi Study Lounge 24/7" → `stream.zeno.fm/f3wvbbqmdg8uv`
  - "Cozy Ambient Rain Lofi" → `stream.zeno.fm/0r0xa792kwzuv`
  - "Coffee Shop & Jazz Lofi Radio" → `stream.zeno.fm/7c8bh802kwzuv`

---

### `https://*.laut.fm/*`

**Reason:** One of the default 24/7 lofi radio stations streams audio from `lofi.stream.laut.fm`. Played via HTML5 `<audio>`.

**Where used:**
- `src/App.jsx` — `DEFAULT_LOFI_STATIONS` array, station "Lofi Hip Hop Radio 24/7"

---

### `https://streams.fluxfm.de/*`

**Reason:** One of the default 24/7 lofi radio stations (Chillhop Radio) streams audio from `streams.fluxfm.de`. Played via HTML5 `<audio>`.

**Where used:**
- `src/App.jsx` — `DEFAULT_LOFI_STATIONS` array, station "Chillhop Radio — Jazzy & Lofi Beats"

---

## Fonts & CDN (CSP only, not host_permissions)

The following are permitted in `content_security_policy` but are **not** in `host_permissions`
because they are loaded as subresources (fonts/stylesheets), not navigated to:

| Domain | Purpose |
|---|---|
| `fonts.googleapis.com` | Google Fonts stylesheet + dynamic font loader in App.jsx |
| `fonts.gstatic.com` | Google Fonts static font file delivery |
| `cdn.jsdelivr.net` | RemixIcon icon font (loaded in `index.html`) |

---

*Last updated: Orbit v1.0.0 — September 2026*
