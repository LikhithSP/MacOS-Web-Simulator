/**
 * Depth Wallpaper Presets
 * 
 * Maps wallpaper paths to their optimal depth effect settings.
 * `subjectTop` is the percentage from the TOP of the screen where the
 * foreground subject starts becoming visible (via gradient mask).
 * 
 * Lower values = subject extends higher up (more clock overlap).
 * Higher values = subject stays lower (less overlap).
 */

export const depthPresets = {
  "/Wallpaper/big-sur-mountains-night-dark-macos-big-sur-stock-california-6016x6016-1493.jpg": {
    name: "Big Sur Mountains Night",
    subjectTop: 26,
    suitable: true,
  },
  "/Wallpaper/macos-big-sur-stock-night-lone-tree-sedimentary-rocks-6016x6016-3776.jpg": {
    name: "Big Sur Lone Tree",
    subjectTop: 30,
    suitable: true,
  },
  "/Wallpaper/11-0-Big-Sur-Day-6k.jpg": {
    name: "Big Sur Day",
    subjectTop: 28,
    suitable: true,
  },
  "/Wallpaper/GoldenGate_6k.png": {
    name: "Golden Gate",
    subjectTop: 34,
    suitable: true,
  },
  "/Wallpaper/Golden_Dark_6k.png": {
    name: "Golden Gate Dark",
    subjectTop: 34,
    suitable: true,
  },
  "/Wallpaper/golden-gate-bridge-san-francicso-lg.jpg": {
    name: "Golden Gate Bridge",
    subjectTop: 36,
    suitable: true,
  },
  "/Wallpaper/13-Ventura-Light.jpg": {
    name: "Ventura Light",
    subjectTop: 30,
    suitable: true,
  },
  "/Wallpaper/macOS-Catalina-Dark-Mode.jpg": {
    name: "Catalina Dark",
    subjectTop: 32,
    suitable: true,
  },
  "/Wallpaper/26-Tahoe-Beach-Dawn-thumb.jpeg": {
    name: "Tahoe Beach Dawn",
    subjectTop: 35,
    suitable: true,
  },
  "/Wallpaper/26-Tahoe-Light-6K-thumb.jpeg": {
    name: "Tahoe Light",
    subjectTop: 32,
    suitable: true,
  },
  "/Wallpaper/chris-brignola-n7n-nkadHRM-unsplash.jpg": {
    name: "Mountain Landscape",
    subjectTop: 28,
    suitable: true,
  },
  "/Wallpaper/formula-1-formula-cars-ferrari-ferrari-f1-ferrari-formula-1-hd-wallpaper-79f662068bca0f4ad0cb02dae8b765b3.jpg": {
    name: "Formula 1",
    subjectTop: 40,
    suitable: true,
  },
  "/Wallpaper/macOS-Sonoma-light.jpg": {
    name: "Sonoma Light",
    subjectTop: 30,
    suitable: true,
  },
  "/Wallpaper/macOS-Sonomaa-dark.jpg": {
    name: "Sonoma Dark",
    subjectTop: 30,
    suitable: true,
  },
  "/Wallpaper/depth-mountain-peak.png": {
    name: "Depth Mountain Peak",
    subjectTop: 25,
    suitable: true,
    recommended: true,
  },
};

/**
 * Get the depth preset for a given wallpaper path.
 * Returns the preset if found, or a default preset.
 */
export const getDepthPreset = (wallpaperPath) => {
  return depthPresets[wallpaperPath] || {
    name: "Custom",
    subjectTop: 30,
    suitable: true,
  };
};

/**
 * Check if a wallpaper has a depth-ready preset.
 */
export const hasDepthPreset = (wallpaperPath) => {
  return wallpaperPath in depthPresets;
};
