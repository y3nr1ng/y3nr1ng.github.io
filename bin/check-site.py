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
              "projects/simscope", "projects/video-editor"]
    pages = {}
    for route in routes:
        path = root / route / "index.html"
        if not path.is_file():
            raise ValueError(f"Missing generated page: {path}")
        source = path.read_text(encoding="utf-8")
        page = Page(source)
        if page.headings != 1:
            raise ValueError(f"Expected one main heading: {path}")
        for placeholder in ["Write your biography here", "Albert Einstein", "you@example.com"]:
            if placeholder in source:
                raise ValueError(f"Starter content in {path}: {placeholder}")
        pages[path] = page

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
    for relative in ["AGENTS.md", "AGENTS.html", ".agents", "cv", "publications", "blog", "projects/1_project"]:
        if (root / relative).exists():
            raise ValueError(f"Unexpected private or sample output: {relative}")
    print(f"Portfolio smoke check passed: {len(pages)} pages, local links, anchors, CSS and output exclusions.")


if __name__ == "__main__":
    try:
        check(sys.argv[1] if len(sys.argv) > 1 else "_site")
    except ValueError as error:
        sys.exit(str(error))
