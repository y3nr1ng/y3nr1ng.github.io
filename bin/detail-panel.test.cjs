const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { JSDOM, VirtualConsole } = require("jsdom");

const site = process.env.SITE_DIR;
const script = readFileSync(site ? join(site, "assets/js/detail-panel.js") : "assets/js/detail-panel.js", "utf8");
const panelModule = import(`data:text/javascript;base64,${Buffer.from(script).toString("base64")}`);
const markup = site
  ? new JSDOM(readFileSync(join(site, "index.html"), "utf8")).window.document.querySelector("[data-detail-panel]").outerHTML
  : readFileSync("_includes/detail-panel.liquid", "utf8").replace(/\{\{\s*'([^']+)'[^}]*\}\}/g, (_match, path) => path);
const tick = () => new Promise((resolve) => setImmediate(resolve));
const source = (name = "Alpha") => `<!doctype html><title>${name} — Yen-Ting Liu</title>
  <main id="main-content"><div class="post"><h1>${name}</h1><article>
    <h2 id="context">Context</h2><p id="caption">A result</p>
    <img src="figure.svg" aria-describedby="caption"><a href="#context">Jump</a>
    <video controls poster="poster.webp" aria-describedby="caption"><source src="movie.mp4" type="video/mp4"></video>
    <a href="/systems/beta/">Another system</a><script>throw new Error('not executed')</script>
  </article></div></main>`;

async function setup(t, { wide = true, supported = true, fetch } = {}) {
  const console = new VirtualConsole();
  console.on("jsdomError", (error) => {
    // jsdom deliberately does not implement full-page navigation.
    if (!error.message.startsWith("Not implemented: navigation")) throw error;
  });
  const dom = new JSDOM(
    `<!doctype html><title>Directory</title><main><h1 id="context">Directory</h1>
      <a id="trigger" href="/projects/alpha/">Alpha</a>
      <a id="second" href="/systems/beta/">Beta</a>
      <a id="external" href="https://elsewhere.test/projects/alpha/">External</a>
      <a id="index" href="/projects/">Index</a>${markup}</main>`,
    { url: "https://portfolio.test/#projects", virtualConsole: console }
  );
  t.after(() => dom.window.close());
  const { window } = dom;
  const { document } = window;
  const dialog = document.querySelector("dialog");
  if (supported) {
    // Native focus trapping/inert behavior belongs to the browser; only stub that boundary.
    dialog.showModal = function () {
      this.open = true;
    };
    dialog.close = function () {
      this.open = false;
    };
  }
  dialog.getBoundingClientRect = () => ({ left: 100, right: 900, top: 50, bottom: 700 });
  const scrolled = [];
  window.HTMLElement.prototype.scrollIntoView = function () {
    scrolled.push(this.id);
  };
  const scrollCalls = [];
  window.scrollTo = (...position) => scrollCalls.push(position);
  Object.defineProperty(window, "scrollY", { value: 540 });
  const media = {
    matches: wide,
    addEventListener: (_type, fn) => {
      media.change = fn;
    },
  };
  window.matchMedia = () => media;
  window.fetch = fetch || (async (url) => ({ ok: true, url, text: async () => source(url.includes("beta") ? "Beta" : "Alpha") }));
  const navigations = [];
  const initialized = (await panelModule).initDetailPanel(window, { navigate: (...args) => navigations.push(args) });
  const click = (selector, options = {}) => {
    const event = new window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...options });
    document.querySelector(selector).dispatchEvent(event);
    return event;
  };
  const traverse = async (direction) => {
    const popped = new Promise((resolve) => window.addEventListener("popstate", resolve, { once: true }));
    window.history[direction]();
    await popped;
    await tick();
  };
  return { window, document, dialog, initialized, click, traverse, media, scrolled, scrollCalls, navigations };
}

test("click opens existing page content, preserves accessible references and URLs, then Back restores focus and position", async (t) => {
  const view = await setup(t);
  assert.equal(view.click("#trigger").defaultPrevented, true);
  await tick();
  assert.equal(view.dialog.open, true);
  assert.equal(view.window.location.pathname, "/projects/alpha/");
  assert.equal(view.document.title, "Alpha — Yen-Ting Liu");
  assert.equal(view.document.activeElement, view.document.querySelector("[data-detail-close]"));
  assert.equal(view.dialog.querySelector("img").src, "https://portfolio.test/projects/alpha/figure.svg");
  assert.equal(view.dialog.querySelector("img").getAttribute("aria-describedby"), "detail-content-caption");
  assert.equal(view.dialog.querySelector("video").poster, "https://portfolio.test/projects/alpha/poster.webp");
  assert.equal(view.dialog.querySelector("video source").src, "https://portfolio.test/projects/alpha/movie.mp4");
  assert.equal(view.dialog.querySelector("video").getAttribute("aria-describedby"), "detail-content-caption");
  assert.equal(view.dialog.querySelector("script"), null);
  const ids = Array.from(view.document.querySelectorAll("[id]"), (node) => node.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(view.document.querySelector("[data-detail-full-page]").href, view.window.location.href);
  await view.traverse("back");
  assert.equal(view.dialog.open, false);
  assert.equal(view.window.location.href, "https://portfolio.test/#projects");
  assert.equal(view.document.title, "Directory");
  assert.equal(view.document.activeElement.id, "trigger");
  assert.deepEqual(view.scrollCalls.at(-1), [0, 540]);
  assert.equal(view.document.body.classList.contains("detail-panel-open"), false);
  await view.traverse("forward");
  assert.equal(view.dialog.open, true);
  assert.equal(view.dialog.querySelector("h1").textContent, "Alpha");
});

test("fragment links and another detail share one panel history entry", async (t) => {
  const view = await setup(t);
  view.document.querySelector("#trigger").href += "#context";
  view.click("#trigger");
  await tick();
  assert.equal(view.scrolled.at(-1), "detail-content-context");
  const historyLength = view.window.history.length;
  view.click('[data-detail-content] a[href$="#context"]');
  assert.equal(view.window.history.length, historyLength);
  view.click('[data-detail-content] a[href$="/systems/beta/"]');
  await tick();
  assert.equal(view.dialog.querySelector("h1").textContent, "Beta");
  assert.equal(view.window.history.length, historyLength);
  await view.traverse("back");
  assert.equal(view.dialog.open, false);
});

test("Escape and the close button return through history without going back twice", async (t) => {
  const view = await setup(t);
  view.click("#trigger");
  await tick();
  const popped = new Promise((resolve) => view.window.addEventListener("popstate", resolve, { once: true }));
  const cancel = new view.window.Event("cancel", { cancelable: true });
  view.dialog.dispatchEvent(cancel);
  view.click("[data-detail-close]");
  assert.equal(cancel.defaultPrevented, true);
  await popped;
  assert.equal(view.dialog.open, false);
  assert.equal(view.window.location.href, "https://portfolio.test/#projects");
});

test("only a press and click outside the panel closes it", async (t) => {
  const view = await setup(t);
  view.click("#trigger");
  await tick();
  const pointer = (type, x, y) => view.dialog.dispatchEvent(new view.window.MouseEvent(type, { bubbles: true, clientX: x, clientY: y }));
  pointer("pointerdown", 200, 100);
  pointer("click", 10, 10);
  assert.equal(view.dialog.open, true);
  const popped = new Promise((resolve) => view.window.addEventListener("popstate", resolve, { once: true }));
  pointer("pointerdown", 10, 10);
  pointer("click", 10, 10);
  await popped;
  assert.equal(view.dialog.open, false);
});

test("mobile, external, index, modified, download and full-page links keep normal navigation", async (t) => {
  const view = await setup(t);
  for (const selector of ["#external", "#index", "[data-detail-full-page]"]) assert.equal(view.click(selector).defaultPrevented, false);
  for (const key of ["ctrlKey", "metaKey", "shiftKey", "altKey"]) assert.equal(view.click("#trigger", { [key]: true }).defaultPrevented, false);
  assert.equal(view.click("#trigger", { button: 1 }).defaultPrevented, false);
  view.document.querySelector("#trigger").setAttribute("download", "");
  assert.equal(view.click("#trigger").defaultPrevented, false);
  view.document.querySelector("#trigger").removeAttribute("download");
  view.media.matches = false;
  assert.equal(view.click("#trigger").defaultPrevented, false);
  assert.equal(view.dialog.open, false);
  assert.equal(view.window.history.length, 1);
});

test("unsupported dialog leaves real links usable", async (t) => {
  const view = await setup(t, { supported: false });
  assert.equal(view.initialized, false);
  assert.equal(view.dialog.hidden, true);
  assert.equal(view.click("#trigger").defaultPrevented, false);
});

test("late responses cannot replace a newer page or resurrect a closed panel", async (t) => {
  const requests = [];
  const view = await setup(t, { fetch: (url, { signal }) => new Promise((resolve) => requests.push({ url, signal, resolve })) });
  view.click("#trigger");
  view.click("#second");
  assert.equal(requests[0].signal.aborted, true);
  const respond = (request, name) => request.resolve({ ok: true, url: request.url, text: async () => source(name) });
  respond(requests[1], "Beta");
  await tick();
  respond(requests[0], "Alpha");
  await tick();
  assert.equal(view.dialog.querySelector("h1").textContent, "Beta");
  await view.traverse("back");
  view.click("#trigger");
  await view.traverse("back");
  respond(requests[2], "Late Alpha");
  await tick();
  assert.equal(view.dialog.open, false);
  assert.equal(view.dialog.querySelector(".post"), null);
  assert.deepEqual(view.navigations, []);
});

test("failed or unexpected content falls back to the actual page; resize uses the full page", async (t) => {
  for (const response of [{ ok: false }, { ok: true, text: async () => "<h1>Not a detail page</h1>" }]) {
    const view = await setup(t, { fetch: async () => response });
    view.click("#trigger");
    await tick();
    assert.deepEqual(view.navigations, [["https://portfolio.test/projects/alpha/", true]]);
  }
  const view = await setup(t);
  view.click("#trigger");
  await tick();
  view.media.matches = false;
  view.media.change();
  assert.deepEqual(view.navigations, [["https://portfolio.test/projects/alpha/", true]]);
});
