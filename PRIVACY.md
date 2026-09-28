# Privacy Notice — Orbit

## Summary

Orbit does not collect, transmit, or sell personal data to any Orbit-controlled server.
The extension has no accounts, analytics, advertising, telemetry, or cloud synchronisation.

---

## Data Storage

All user data — settings, tasks, routines, time-boxing groups, activity streaks, shortcuts,
wallpapers, and widget configuration — is stored exclusively in the local browser profile
using `chrome.storage.local` (with `localStorage` as a fallback in non-extension contexts).

Data never leaves the device unless the user explicitly exports it. No data is shared between
browser profiles, devices, or users.

---

## External Services

Orbit does not have a backend server. However, certain optional features contact
third-party services directly from the browser. These contacts are initiated by
explicit user action or configuration.

| Service | When contacted | Data sent |
|---|---|---|
| **Open-Meteo** (`api.open-meteo.com`) | When the Clock widget displays weather. Requires the user to grant browser geolocation permission. | Device latitude & longitude (obtained from the browser Geolocation API). |
| **YouTube** (`youtube.com`, `youtube-nocookie.com`, `googlevideo.com`) | When the user configures a YouTube video or playlist URL in the SongPlayer widget. | Standard browser request (no Orbit-specific user data). YouTube's privacy policy applies. |
| **Spotify** (`open.spotify.com`) | When the user configures a Spotify URL in the SongPlayer widget. The link is rendered as a Spotify embed iframe. | Standard browser request. Spotify's privacy policy applies. |
| **Lofi Radio Streams** (`zeno.fm`, `laut.fm`, `streams.fluxfm.de`, `streams.ilovemusic.de`) | When the user plays a built-in lofi radio station. Audio is streamed directly via an HTML5 `<audio>` element. | Standard browser request (IP address visible to the stream server). |
| **Google Fonts** (`fonts.googleapis.com`, `fonts.gstatic.com`) | When the user selects a Google Font as the base font in Settings. | Font family name. Google's privacy policy applies. |
| **jsDelivr CDN** (`cdn.jsdelivr.net`) | On every page load — the RemixIcon icon font is loaded from jsDelivr. | Standard browser request. |

All third-party services are subject to their own privacy policies. Orbit does not control
what data those services collect.

---

## Permissions

| Permission | Purpose |
|---|---|
| `storage` | Read/write user settings and workspace data to `chrome.storage.local`. |
| `unlimitedStorage` | Allows storage of user-uploaded wallpaper images and videos without hitting the default 5 MB quota. |
| `declarativeNetRequest` | Modifies request headers (Referer, Origin) for YouTube iframes so they load correctly in the extension context. Rules are declared statically in `rules.json`. |

---

## What Orbit Does Not Do

- Does not collect or transmit browsing history
- Does not read or modify web page content (no content scripts)
- Does not communicate with any Orbit-owned or Orbit-operated server
- Does not use cookies
- Does not include advertising or tracking SDKs
- Does not share data between users
- Does not authenticate users or create accounts

---

*Last updated: Orbit v1.0.0 — September 2026*
