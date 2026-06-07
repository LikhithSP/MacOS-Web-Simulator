import { create } from "zustand";

// Create persistent audio instance
const audioInstance = new Audio('https://pagallworlds.com/wp-content/uploads/2023/06/I-Wanna-Be-Yours-Slowed-Reverb.mp3');

export const useAppStore = create((set, get) => ({
  windows: [],
  maxZ: 1,
  isLocked: false,
  isAudioPlaying: false,

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
