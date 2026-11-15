const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const vm = require("node:vm");

// Exercise the real theme script with DOM/storage/media-query boundaries only.
function openPage(storage = new Map(), prefersDark = false) {
  const attrs = new Map();
  const handlers = {};
  let ready = false;
  const buttons = ["system", "light", "dark"].map((mode) => ({
    dataset: { themeMode: mode },
    attrs: {},
    setAttribute(name, value) {
      this.attrs[name] = value;
    },
    addEventListener(name, fn) {
      this[name] = fn;
    },
  }));
  const media = { matches: prefersDark, addEventListener: (_name, fn) => (handlers.system = fn) };
  const elements = { highlight_theme_light: {}, highlight_theme_dark: {} };
  const context = vm.createContext({
    localStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    window: { matchMedia: () => media, setTimeout: (fn) => fn() },
    document: {
      documentElement: { setAttribute: (key, value) => attrs.set(key, value), classList: { add() {}, remove() {} } },
      getElementById: (id) => elements[id] || null,
      querySelector: () => null,
      querySelectorAll: (query) => (ready && query === "[data-theme-mode]" ? buttons : []),
      getElementsByTagName: () => [],
      getElementsByClassName: () => [],
      addEventListener: (_name, fn) => (handlers.ready = fn),
    },
  });
  vm.runInContext(readFileSync("assets/js/theme.js", "utf8") + "\ninitTheme();", context);
  ready = true;
  handlers.ready();
  return {
    selected: () => buttons.filter((button) => button.attrs["aria-pressed"] === "true").map((button) => button.dataset.themeMode),
    theme: () => attrs.get("data-theme"),
    choose(value) {
      buttons.find((button) => button.dataset.themeMode === value).click();
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
  assert.deepEqual(page.selected(), ["system"]);
  assert.equal(page.theme(), "light");
  page.system(true);
  assert.equal(page.theme(), "dark");
  assert.deepEqual(page.selected(), ["system"]);
  page.choose("light");
  assert.equal(page.theme(), "light");
  page.system(true);
  assert.equal(page.theme(), "light");
  const nextPage = openPage(storage, true);
  assert.deepEqual(nextPage.selected(), ["light"]);
  assert.equal(nextPage.theme(), "light");
  nextPage.choose("dark");
  assert.deepEqual(nextPage.selected(), ["dark"]);
  nextPage.system(false);
  assert.equal(nextPage.theme(), "dark");
  nextPage.choose("system");
  assert.deepEqual(nextPage.selected(), ["system"]);
  assert.equal(nextPage.theme(), "light");
  nextPage.system(true);
  assert.equal(nextPage.theme(), "dark");
});

test("unrecognized stored preference falls back to Auto", () => {
  const page = openPage(new Map([["theme", "unknown"]]), true);
  assert.deepEqual(page.selected(), ["system"]);
  assert.equal(page.theme(), "dark");
});
