const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");
const { JSDOM } = require("jsdom");

const site = process.env.SITE_DIR;
const page = () => new JSDOM(readFileSync(join(site, "index.html"), "utf8"), { url: "https://portfolio.test/" });

for (const article of ["infrared-microscopy", "light-sheet-microscopy", "single-molecule-microscopy"]) {
  test(`${article} keeps figures and publication references navigable`, { skip: !site }, () => {
    const dom = new JSDOM(readFileSync(join(site, "systems", article, "index.html"), "utf8"), {
      url: `https://portfolio.test/systems/${article}/`,
    });
    try {
      const document = dom.window.document;
      const publications = [...document.querySelectorAll(".related-publications a")];
      assert.ok(publications.length > 0, "Publication HTML must render as links rather than a Markdown code block");
      for (const link of publications) {
        assert.ok(link.textContent.trim());
        assert.equal(new URL(link.href).protocol, "https:");
      }
      const figures = [...document.querySelectorAll(".article-figure")];
      assert.ok(figures.length > 0);
      for (const figure of figures) {
        const image = figure.querySelector("img");
        const link = figure.querySelector(".article-image-link");
        assert.ok(image.alt.trim());
        assert.ok(image.width > 0 && image.height > 0);
        const imageUrl = new URL(image.src);
        assert.equal(imageUrl.origin, dom.window.location.origin);
        assert.ok(existsSync(join(site, imageUrl.pathname)));
        assert.equal(link.href, image.src);
        assert.ok(figure.querySelector("figcaption").textContent.trim());
        assert.ok(figure.querySelector('.figure-credit a[href="https://creativecommons.org/licenses/by/4.0/"]'));
      }
    } finally {
      dom.window.close();
    }
  });
}

test("section selectors identify their own section and link to real, distinct destinations", { skip: !site }, () => {
  const dom = page();
  try {
    const document = dom.window.document;
    const selectors = [...document.querySelectorAll(".portfolio-section-switch")];
    assert.ok(selectors.length >= 2);
    for (const selector of selectors) {
      const section = selector.closest("section");
      const links = [...selector.querySelectorAll("a")];
      assert.equal(links.filter((link) => link.hasAttribute("aria-current")).length, 1);
      const destinations = links.map((link) => {
        const url = new URL(link.href);
        assert.equal(url.origin, dom.window.location.origin);
        assert.ok(link.textContent.trim());
        const destination = document.getElementById(url.hash.slice(1));
        assert.ok(destination, `Missing destination: ${url.hash}`);
        if (link.hasAttribute("aria-current")) assert.equal(destination, section);
        return destination;
      });
      assert.equal(new Set(destinations).size, links.length);
    }
  } finally {
    dom.window.close();
  }
});

test("system references stay outside disclosures and thumbnails have text alternatives", { skip: !site }, () => {
  const dom = page();
  try {
    const document = dom.window.document;
    const references = [...document.querySelectorAll(".system-related")];
    assert.ok(references.length > 0);
    for (const reference of references) {
      assert.equal(reference.closest('details, [hidden], [aria-hidden="true"]'), null);
      assert.ok(reference.querySelector("a[href]"));
      assert.equal(reference.querySelector('[hidden], [aria-hidden="true"]'), null);
      for (const link of reference.querySelectorAll("a[href]")) {
        assert.ok(link.textContent.trim());
        const url = new URL(link.href);
        assert.ok(["https:", "http:"].includes(url.protocol));
      }
      for (const publication of reference.querySelectorAll(".project-publications a")) {
        assert.ok(publication.getAttribute("aria-label")?.includes(publication.textContent.trim()));
        assert.ok(publication.title.trim());
      }
    }
    const thumbnails = [...document.querySelectorAll(".portfolio-thumbnail img")];
    assert.ok(thumbnails.length > 0);
    for (const image of thumbnails) {
      assert.ok(image.alt.trim());
      assert.ok(Number(image.width) > 0);
      assert.equal(image.width, image.height);
    }
  } finally {
    dom.window.close();
  }
});
