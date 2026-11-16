const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { JSDOM } = require("jsdom");

const site = process.env.SITE_DIR;
const page = () => new JSDOM(readFileSync(join(site, "index.html"), "utf8"), { url: "https://portfolio.test/" });

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

test("system references use labeled native disclosures and thumbnails have text alternatives", { skip: !site }, () => {
  const dom = page();
  try {
    const document = dom.window.document;
    const disclosures = [...document.querySelectorAll(".system-related")];
    assert.ok(disclosures.length > 0);
    for (const disclosure of disclosures) {
      assert.equal(disclosure.tagName, "DETAILS");
      const summary = disclosure.firstElementChild;
      assert.equal(summary.tagName, "SUMMARY");
      assert.ok(summary.textContent.trim());
      assert.equal(summary.querySelector("a, button, input"), null);
      assert.ok(disclosure.querySelector("a[href]"));
      for (const link of disclosure.querySelectorAll("a[href]")) {
        assert.ok(link.textContent.trim());
        const url = new URL(link.href);
        assert.ok(["https:", "http:"].includes(url.protocol));
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
