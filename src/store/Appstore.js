import { create } from "zustand";
import { songs } from "../constants/songs";

// Create persistent audio instance
export const audioInstance = new Audio('https://pagallworlds.com/wp-content/uploads/2023/06/I-Wanna-Be-Yours-Slowed-Reverb.mp3');

export const useAppStore = create((set, get) => ({
  windows: [],
  maxZ: 1,
  isLocked: false,
  isAudioPlaying: false,
  isDarkMode: localStorage.getItem('os_dark_mode') === 'true',
  currentTrack: songs[1], // Wanna Be Yours as default
  setCurrentTrack: (track) => set({ currentTrack: track }),
  nextTrack: () => set((state) => {
    const idx = songs.findIndex(s => s.title === state.currentTrack.title);
    const nextIdx = idx === -1 ? 0 : (idx + 1) % songs.length;
    return { currentTrack: songs[nextIdx] };
  }),
  prevTrack: () => set((state) => {
    const idx = songs.findIndex(s => s.title === state.currentTrack.title);
    const prevIdx = idx <= 0 ? songs.length - 1 : idx - 1;
    return { currentTrack: songs[prevIdx] };
  }),
  toggleDarkMode: () => set((state) => {
    const next = !state.isDarkMode;
    localStorage.setItem('os_dark_mode', String(next));
    return { isDarkMode: next };
  }),

  openApp: (appId, component) =>
    set((state) => {
      const newZ = state.maxZ + 1;
      return {
        maxZ: newZ,
        windows: [
          ...state.windows,
          {
            id: Date.now(),
            appId,
            component,
            minimized: false,
            maximized: false,
            z: newZ,
            // Store original position for restore
            prevSize: null,
          },
        ],
      };
    }),

  closeApp: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  focusApp: (id) =>
    set((state) => {
      const newZ = state.maxZ + 1;
      return {
        maxZ: newZ,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, z: newZ } : w
        ),
      };
    }),

  minimizeApp: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      ),
    })),

  restoreApp: (id) =>
    set((state) => {
      const newZ = state.maxZ + 1;
      return {
        maxZ: newZ,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, minimized: false, z: newZ } : w
        ),
      };
    }),

  toggleMaximize: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized } : w
      ),
    })),

  setLocked: (locked) =>
    set({ isLocked: locked }),

  // Hide all windows (for lock screen)
  hideAllWindows: () =>
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, minimized: true })),
    })),

  toggleAudio: () =>
    set((state) => {
      if (state.isAudioPlaying) {
        audioInstance.pause();
      } else {
        audioInstance.play();
      }
      return { isAudioPlaying: !state.isAudioPlaying };
    }),

  playAudio: () =>
    set((state) => {
      if (!state.isAudioPlaying) {
        audioInstance.play();
        return { isAudioPlaying: true };
      }
      return state;
    }),

  pauseAudio: () =>
    set((state) => {
      if (state.isAudioPlaying) {
        audioInstance.pause();
        return { isAudioPlaying: false };
      }
      return state;
    }),
}));
