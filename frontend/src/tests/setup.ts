import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

globalThis.TextEncoder = TextEncoder;

// @ts-ignore
globalThis.TextDecoder = TextDecoder;
// -----------------------------
// Mock ResizeObserver
// -----------------------------
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;

// -----------------------------
// Mock matchMedia
// -----------------------------
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// -----------------------------
// Mock scrollTo
// -----------------------------
window.scrollTo = jest.fn();

// -----------------------------
// Mock IntersectionObserver
// -----------------------------
class IntersectionObserverMock {
  root = null;
  rootMargin = "";
  thresholds = [];

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}
globalThis.IntersectionObserver =
  IntersectionObserverMock as any;

// -----------------------------
// Mock localStorage
// -----------------------------
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] ?? null),

    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),

    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),

    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// -----------------------------
// Mock sessionStorage
// -----------------------------
Object.defineProperty(window, "sessionStorage", {
  value: localStorageMock,
});
const originalError = console.error;

beforeAll(() => {
  console.error = (...args) => {
    if (
      args[0]?.includes(
        "not wrapped in act"
      )
    ) {
      return;
    }

    originalError(...args);
  };
});