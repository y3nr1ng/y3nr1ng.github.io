// Progressive enhancement: the original pages remain the content source and fallback.
export function initDetailPanel(window, { navigate = (url, replace = false) => window.location[replace ? "replace" : "assign"](url) } = {}) {
  const { document } = window;
  const dialog = document.querySelector("[data-detail-panel]");
  if (!dialog || typeof dialog.showModal !== "function" || !window.fetch) return false;
  dialog.hidden = false;

  const content = dialog.querySelector("[data-detail-content]");
  const title = dialog.querySelector("#detail-panel-title");
  const fullPage = dialog.querySelector("[data-detail-full-page]");
  const closeButton = dialog.querySelector("[data-detail-close]");
  const desktop = window.matchMedia("(min-width: 901px)");
  const roots = dialog.dataset.detailRoots.split(" ");
  const session = window.crypto.randomUUID();
  const backgroundTitle = document.title;
  let trigger = null;
  let scroll = [0, 0];
  let currentUrl = null;
  let controller = null;
  let generation = 0;
  let closing = false;
  let backdropPress = false;

  const ownsEntry = () => window.history.state?.detailPanel === session;
  const isDetail = (url) => url.origin === window.location.origin && roots.some((root) => url.pathname.startsWith(root) && url.pathname !== root);
  const setUrl = (url, method) => window.history[method]({ ...window.history.state, detailPanel: session }, "", url.href);

  function scrollToAnchor(url) {
    dialog.scrollTop = 0;
    if (!url.hash) return;
    let id;
    try {
      id = decodeURIComponent(url.hash.slice(1));
    } catch {
      return;
    }
    const target = Array.from(content.querySelectorAll("[data-detail-anchor]")).find((node) => node.dataset.detailAnchor === id);
    target?.scrollIntoView({ block: "start" });
  }

  function preparePost(source, url) {
    const post = document.importNode(source, true);
    post.querySelectorAll("script, base").forEach((node) => node.remove());
    // Keep images and links relative to their source page, including fragment links.
    for (const node of post.querySelectorAll("[href], [src], [poster]")) {
      for (const attribute of ["href", "src", "poster"]) {
        if (node.hasAttribute(attribute)) node.setAttribute(attribute, new URL(node.getAttribute(attribute), url).href);
      }
    }
    // Imported headings must not duplicate IDs in the directory behind the panel.
    const ids = new Map();
    for (const node of post.querySelectorAll("[id]")) {
      const original = node.id;
      node.dataset.detailAnchor = original;
      node.id = `detail-content-${original}`;
      ids.set(original, node.id);
    }
    for (const node of post.querySelectorAll("[aria-labelledby], [aria-describedby], [for]")) {
      for (const attribute of ["aria-labelledby", "aria-describedby", "for"]) {
        if (node.hasAttribute(attribute)) {
          node.setAttribute(
            attribute,
            node
              .getAttribute(attribute)
              .split(/\s+/)
              .map((id) => ids.get(id) || id)
              .join(" ")
          );
        }
      }
    }
    return post;
  }

  async function open(url, historyMethod = null) {
    const wasOpen = dialog.open;
    closing = false;
    const request = ++generation;
    controller?.abort();
    controller = new window.AbortController();
    const { signal } = controller;
    currentUrl = url;
    if (historyMethod) setUrl(url, historyMethod);
    fullPage.href = url.href;
    title.textContent = "Loading details";
    content.setAttribute("aria-busy", "true");
    const loading = document.createElement("p");
    loading.setAttribute("role", "status");
    loading.textContent = "Loading…";
    content.replaceChildren(loading);
    if (!wasOpen) {
      document.body.classList.add("detail-panel-open");
      dialog.showModal();
    }
    dialog.scrollTop = 0;
    closeButton.focus({ preventScroll: true });
    try {
      const response = await window.fetch(url.href, { signal });
      if (!response.ok) throw new Error("Detail page unavailable");
      const sourceUrl = new URL(response.url || url.href);
      if (!isDetail(sourceUrl)) throw new Error("Unexpected detail page");
      const source = new window.DOMParser().parseFromString(await response.text(), "text/html");
      const post = source.querySelector("#main-content > .post");
      if (!post) throw new Error("Detail content missing");
      if (signal.aborted || request !== generation || !dialog.open) return;
      content.replaceChildren(preparePost(post, sourceUrl));
      content.removeAttribute("aria-busy");
      title.textContent = post.querySelector("h1")?.textContent || "Project details";
      document.title = source.title || title.textContent;
      scrollToAnchor(url);
    } catch {
      if (!signal.aborted && request === generation) navigate(url.href, true);
    }
  }

  function hide() {
    ++generation;
    controller?.abort();
    document.body.classList.remove("detail-panel-open");
    if (dialog.open) dialog.close();
    content.replaceChildren();
    content.removeAttribute("aria-busy");
    document.title = backgroundTitle;
    closing = false;
    trigger?.focus({ preventScroll: true });
    window.scrollTo(...scroll);
  }

  function requestClose() {
    if (closing || !dialog.open) return;
    closing = true;
    if (ownsEntry()) window.history.back();
    else hide();
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.hasAttribute("download") || (link.target && link.target !== "_self") || link.hasAttribute("data-detail-full-page")) return;
    const url = new URL(link.href, window.location.href);
    if (!desktop.matches || !isDetail(url)) return;
    event.preventDefault();
    if (dialog.open && currentUrl?.pathname === url.pathname && currentUrl?.search === url.search && content.querySelector(".post")) {
      currentUrl = url;
      fullPage.href = url.href;
      setUrl(url, "replaceState");
      scrollToAnchor(url);
      return;
    }
    if (!dialog.open) {
      trigger = link;
      scroll = [window.scrollX, window.scrollY];
    }
    void open(url, dialog.open ? "replaceState" : "pushState");
  });

  closeButton.addEventListener("click", requestClose);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    requestClose();
  });
  const outside = (event) => {
    const bounds = dialog.getBoundingClientRect();
    return (
      event.target === dialog &&
      (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)
    );
  };
  dialog.addEventListener("pointerdown", (event) => {
    backdropPress = outside(event);
  });
  dialog.addEventListener("click", (event) => {
    if (backdropPress && outside(event)) requestClose();
    backdropPress = false;
  });
  window.addEventListener("popstate", () => {
    if (ownsEntry()) {
      if (desktop.matches) void open(new URL(window.location.href));
      else navigate(window.location.href, true);
    } else if (dialog.open) hide();
  });
  desktop.addEventListener("change", () => {
    if (!desktop.matches && dialog.open) navigate(currentUrl.href, true);
  });
  return true;
}

if (typeof window !== "undefined") initDetailPanel(window);
