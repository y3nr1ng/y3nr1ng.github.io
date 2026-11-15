const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const vm = require("node:vm");

// Exercise the real theme script with DOM/storage/media-query boundaries only.
function openPage(storage = new Map(), prefersDark = false) {
  const attrs = new Map();
  const handlers = {};
  let ready = false;
  const icon = {};
  const tooltip = {};
  const button = {
    querySelector: (query) => (query === "i" ? icon : tooltip),
    attrs: {},
    setAttribute(name, value) {
      this.attrs[name] = value;
    },
    addEventListener(name, fn) {
      this[name] = fn;
    },
  };
  const timers = new Map();
  let timerId = 0;
  const classes = new Set();
  const media = { matches: prefersDark, addEventListener: (_name, fn) => (handlers.system = fn) };
  const elements = { highlight_theme_light: {}, highlight_theme_dark: {} };
  const context = vm.createContext({
    localStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    window: {
      matchMedia: () => media,
      setTimeout: (fn) => {
        timers.set(++timerId, fn);
        return timerId;
      },
      clearTimeout: (id) => timers.delete(id),
    },
    document: {
      documentElement: {
        setAttribute: (key, value) => attrs.set(key, value),
        classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) },
      },
      getElementById: (id) => elements[id] || null,
      querySelector: () => null,
      querySelectorAll: (query) => (ready && query === "[data-theme-cycle]" ? [button] : []),
      getElementsByTagName: () => [],
      getElementsByClassName: () => [],
      addEventListener: (_name, fn) => (handlers.ready = fn),
    },
  });
  vm.runInContext(readFileSync("assets/js/theme.js", "utf8") + "\ninitTheme();", context);
  ready = true;
  handlers.ready();
  return {
    selected: () => storage.get("theme"),
    label: () => button.attrs["aria-label"],
    icon: () => icon.className,
    tooltip: () => tooltip.textContent,
    pendingTransitions: () => timers.size,
    transitioning: () => classes.has("transition"),
    finishTransition() {
      for (const fn of timers.values()) fn();
      timers.clear();
    },
    theme: () => attrs.get("data-theme"),
    cycle() {
      button.click();
    },
    system(value) {
      media.matches = value;
      handlers.system({ matches: value });
    },
  };
}

test("Auto follows system changes and updates the next action; explicit choices survive navigation", () => {
  const storage = new Map();
  const page = openPage(storage, false);
  assert.equal(page.selected(), "system");
  assert.equal(page.theme(), "light");
  assert.equal(page.tooltip(), "Auto → Dark");
  page.system(true);
  assert.equal(page.theme(), "dark");
  assert.equal(page.selected(), "system");
  assert.equal(page.tooltip(), "Auto → Light");
  page.cycle();
  assert.equal(page.selected(), "light");
  assert.equal(page.theme(), "light");
  page.system(false);
  assert.equal(page.selected(), "light");
  assert.equal(page.theme(), "light");
  assert.equal(page.tooltip(), "Light → Auto");
  const nextPage = openPage(storage, false);
  assert.equal(nextPage.selected(), "light");
  nextPage.cycle();
  assert.equal(nextPage.selected(), "system");
  nextPage.system(true);
  assert.equal(nextPage.theme(), "dark");
  assert.equal(nextPage.tooltip(), "Auto → Light");
});

test("unrecognized stored preference falls back to Auto", () => {
  const page = openPage(new Map([["theme", "unknown"]]), true);
  assert.equal(page.selected(), "system");
  assert.equal(page.theme(), "dark");
});

for (const prefersDark of [false, true]) {
  test(`Auto defaults to ${prefersDark ? "dark" : "light"} and cycles opposite first without stale timers`, () => {
    const page = openPage(new Map(), prefersDark);
    const modes = prefersDark
      ? [
          ["system", "Auto", "Light", "desktop", "dark"],
          ["light", "Light", "Dark", "sun", "light"],
          ["dark", "Dark", "Auto", "moon", "dark"],
        ]
      : [
          ["system", "Auto", "Dark", "desktop", "light"],
          ["dark", "Dark", "Light", "moon", "dark"],
          ["light", "Light", "Auto", "sun", "light"],
        ];
    for (let i = 0; i < 9; i++) {
      const [mode, name, next, icon, appearance] = modes[i % 3];
      assert.equal(page.selected(), mode);
      assert.equal(page.theme(), appearance);
      assert.equal(page.label(), `${name} theme. Switch to ${next} theme`);
      assert.equal(page.tooltip(), `${name} → ${next}`);
      assert.equal(page.icon(), `fa-solid fa-${icon}`);
      assert.equal(page.pendingTransitions(), 1);
      assert.equal(page.transitioning(), true);
      page.cycle();
    }
    page.finishTransition();
    assert.equal(page.transitioning(), false);
  });
}
