import '@testing-library/jest-dom';

// Polyfill BroadcastChannel if not available in environment
if (typeof globalThis.BroadcastChannel === 'undefined') {
  globalThis.BroadcastChannel = class BroadcastChannel {
    constructor(name) {
      this.name = name;
      this.listeners = [];
    }
    postMessage(_data) {
      // In-memory dispatch to other channels with same name if needed
    }
    addEventListener(type, listener) {
      if (type === 'message') this.listeners.push(listener);
    }
    removeEventListener(type, listener) {
      if (type === 'message') {
        this.listeners = this.listeners.filter((l) => l !== listener);
      }
    }
    close() {
      this.listeners = [];
    }
  };
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock navigator.clipboard
if (!navigator.clipboard) {
  navigator.clipboard = {
    writeText: async () => {},
  };
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
