const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const vm = require("node:vm");

// Exercise the real theme script with DOM/storage/media-query boundaries only.
function openPage(storage = new Map(), prefersDark = false) {
  const attrs = new Map();
  const handlers = {};
  const selector = { value: "system", addEventListener: (name, fn) => (handlers[name] = fn) };
  const media = { matches: prefersDark, addEventListener: (_name, fn) => (handlers.system = fn) };
  const elements = { "theme-setting": selector, highlight_theme_light: {}, highlight_theme_dark: {} };
  const context = vm.createContext({
    localStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    window: { matchMedia: () => media, setTimeout: (fn) => fn() },
    document: {
      documentElement: { setAttribute: (key, value) => attrs.set(key, value), classList: { add() {}, remove() {} } },
      getElementById: (id) => elements[id] || null,
      querySelector: () => null,
      getElementsByTagName: () => [],
      getElementsByClassName: () => [],
      addEventListener: (_name, fn) => (handlers.ready = fn),
    },
  });
  vm.runInContext(readFileSync("assets/js/theme.js", "utf8") + "\ninitTheme();", context);
  handlers.ready();
  return {
    selector,
    theme: () => attrs.get("data-theme"),
    choose(value) {
      selector.value = value;
      handlers.change();
    },
    system(value) {
      media.matches = value;
      handlers.system({ matches: value });
    },
  };
}

test("Auto follows system changes; explicit choices remain stable and survive navigation", () => {
  const storage = new Map();
  const page = openPage(storage, false);
  assert.equal(page.selector.value, "system");
  assert.equal(page.theme(), "light");
  page.system(true);
  assert.equal(page.theme(), "dark");
  page.choose("light");
  assert.equal(page.theme(), "light");
  page.system(true);
  assert.equal(page.theme(), "light");
  const nextPage = openPage(storage, true);
  assert.equal(nextPage.selector.value, "light");
  assert.equal(nextPage.theme(), "light");
  nextPage.choose("dark");
  nextPage.system(false);
  assert.equal(nextPage.theme(), "dark");
  nextPage.choose("system");
  assert.equal(nextPage.theme(), "light");
  nextPage.system(true);
  assert.equal(nextPage.theme(), "dark");
});

test("unrecognized stored preference falls back to Auto", () => {
  const page = openPage(new Map([["theme", "unknown"]]), true);
  assert.equal(page.selector.value, "system");
  assert.equal(page.theme(), "dark");
});
