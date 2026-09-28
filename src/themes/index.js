/**
 * UI Theme Registry
 * Each theme is CSS-only and lives in its own file in this folder.
 * Logic (state, storage, events) lives entirely in App.jsx.
 * To add a theme: add an entry here + create a matching CSS file.
 */

export const UI_THEMES = [
  {
    id: "default",
    name: "Default Glass",
    description: "Sleek glassmorphism backdrop with modern typography & clean cards",
    icon: "ri-sparkling-2-fill",
    image: "/default-wallpaper.jpg",
    preview: ["#7DD3FC", "#0EA5E9", "#0369A1", "#0C4A6E"],
  },
  {
    id: "manga",
    name: "Manga Style",
    description: "Black & white comic book layout, ink-bordered panels & speed-line styling",
    icon: "ri-book-2-line",
    image: "/manga-wallpaper.jpg",
    preview: ["#FFFFFF", "#CCCCCC", "#666666", "#111111"],
    beta: true,
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk 2077",
    description: "Neon glow accents, corner bracket HUD frames, dark grid & Rajdhani font",
    icon: "ri-cpu-line",
    image: "/cyberpunk-wallpaper.png",
    preview: ["#FF0055", "#FF0080", "#990033", "#08020D"],
  },
  {
    id: "pixel",
    name: "CLI Terminal",
    description: "eDEX-UI sci-fi terminal interface with double-line borders, Share Tech Mono font & phosphor glow",
    icon: "ri-terminal-box-line",
    image: "/cli-wallpaper.jpg",
    preview: ["#00FF66", "#33FF88", "#003311", "#05100A"],
  },
  {
    id: "winter",
    name: "Winter Arc",
    description: "Cold, focused workspace for deep work and discipline",
    icon: "ri-snowy-line",
    image: "/winter-wallpaper.png",
    preview: ["#DDF6FF", "#8FD3F4", "#4EA8D8", "#12324A"],
    private: true,
  },
];

// Keep private/development themes registered for local development while
// exposing only explicitly public themes to the user-facing selector.
export const PUBLIC_UI_THEMES = UI_THEMES.filter((theme) => !theme.private);
export const PRIVATE_UI_THEMES = UI_THEMES.filter((theme) => theme.private);
export const PUBLIC_THEME_IDS = new Set(PUBLIC_UI_THEMES.map((theme) => theme.id));

export const STORAGE_KEY_UI_THEME = "settings_ui_theme_v1";
