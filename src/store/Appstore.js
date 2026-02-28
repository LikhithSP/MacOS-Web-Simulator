import { create } from "zustand";

export const useAppStore = create((set, get) => ({
  windows: [],
  maxZ: 1,
  isLocked: false,

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
}));
