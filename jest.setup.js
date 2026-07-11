// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// jsdom does not implement structuredClone; polyfill for libraries (e.g. VexFlow) that use it.
if (typeof globalThis.structuredClone === "undefined") {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// jsdom does not implement ResizeObserver; used by useLinearKeyboardDoDisplayText.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock Tone.js to prevent ES module issues in Jest
jest.mock("tone", () => ({
  PolySynth: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockReturnThis(),
    disconnect: jest.fn(),
    triggerAttackRelease: jest.fn(),
    dispose: jest.fn(),
    toDestination: jest.fn().mockReturnThis(),
    releaseAll: jest.fn(),
    set: jest.fn(),
  })),
  Synth: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockReturnThis(),
    triggerAttack: jest.fn(),
    triggerRelease: jest.fn(),
    dispose: jest.fn(),
  })),
  Filter: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockReturnThis(),
    toDestination: jest.fn().mockReturnThis(),
    dispose: jest.fn(),
  })),
  Destination: {
    connect: jest.fn(),
  },
  getContext: jest.fn().mockReturnValue({
    state: "running",
    resume: jest.fn().mockResolvedValue(undefined),
    lookAhead: 0.05,
  }),
  getDestination: jest.fn().mockReturnValue({
    volume: {
      value: 0,
    },
  }),
  start: jest.fn().mockResolvedValue(undefined),
}));

// Mock PostHog to avoid init/capture warnings in component integration tests.
jest.mock("@/lib/tracking/ph", () => ({
  initPH: jest.fn(),
  ph: {
    __loaded: true,
    capture: jest.fn(),
  },
}));
