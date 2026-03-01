import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

// Cleanup after each test
if (typeof afterEach !== "undefined") {
  afterEach(() => {
    cleanup();
  });
}

// --- Mocks removed to resolve lint warnings ---

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof global.IntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: () => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
