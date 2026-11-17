"""Small, dependency-free smoke check for the generated portfolio."""

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.links = []
        self.ids = set()
        self.headings = 0
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "h1":
            self.headings += 1
        if tag == "a" and "href" in attrs:
            self.links.append(attrs["href"])


def check(destination):
    root = Path(destination).resolve()
    routes = ["", "projects", "projects/scopeengine", "projects/not-envi",
              "projects/simscope", "projects/video-editor", "systems/infrared-microscopy",
              "systems/light-sheet-microscopy"]
    pages = {}
    for route in routes:
        path = root / route / "index.html"
        if not path.is_file():
            raise ValueError(f"Missing generated page: {path}")
        source = path.read_text(encoding="utf-8")
        page = Page(source)
        if page.headings != 1:
            raise ValueError(f"Expected one main heading: {path}")
        if "navbar" in page.ids or "theme-setting" not in page.ids:
            raise ValueError(f"Expected corner theme control without a navigation bar: {path}")
        for placeholder in ["Write your biography here", "Albert Einstein", "you@example.com"]:
            if placeholder in source:
                raise ValueError(f"Starter content in {path}: {placeholder}")
        pages[path] = page
        if route in ["", "projects"]:
            if source.count("data-detail-panel") != 1 or "detail-panel.js" not in source:
                raise ValueError(f"Detail panel enhancement missing: {path}")

    homepage_links = {urlsplit(link).path for link in pages[root / "index.html"].links}
    for route in routes[2:]:
        if "/" + route + "/" not in homepage_links:
            raise ValueError(f"Detail page missing from entrance page: {route}")

    for path, page in pages.items():
        for href in page.links:
            link = urlsplit(href)
            if link.scheme or link.netloc:
                continue
            target = root / unquote(link.path).lstrip("/") if link.path.startswith("/") else path.parent / unquote(link.path)
            if not link.path:
                target = path
            elif target.is_dir():
                target /= "index.html"
            target = target.resolve()
            if not target.is_relative_to(root) or not target.is_file():
                raise ValueError(f"Broken internal link in {path}: {href}")
            if link.fragment and target.suffix == ".html":
                target_page = pages.get(target) or Page(target.read_text(encoding="utf-8"))
                if unquote(link.fragment) not in target_page.ids:
                    raise ValueError(f"Missing anchor in {path}: {href}")

    css = root / "assets/css/main.css"
    if not css.is_file() or ".portfolio-hero" not in css.read_text(encoding="utf-8"):
        raise ValueError("Portfolio stylesheet missing from generated output")
    if ".detail-panel::backdrop" not in css.read_text(encoding="utf-8"):
        raise ValueError("Detail panel styling missing after CSS purging")
    if not (root / "assets/js/detail-panel.js").is_file():
        raise ValueError("Detail panel script missing from generated output")
    for relative in ["AGENTS.md", "AGENTS.html", ".agents", "cv", "publications", "blog", "projects/1_project"]:
        if (root / relative).exists():
            raise ValueError(f"Unexpected private or sample output: {relative}")
    print(f"Portfolio smoke check passed: {len(pages)} pages, local links, anchors, CSS and output exclusions.")


if __name__ == "__main__":
    try:
        check(sys.argv[1] if len(sys.argv) > 1 else "_site")
    except ValueError as error:
        sys.exit(str(error))
