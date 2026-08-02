from __future__ import annotations

import html
import json
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parent
CONTENT = ROOT / "content"
SITE_URL = "https://luisguacache.com"


@dataclass
class Document:
    source: Path
    kind: str
    meta: dict[str, str]
    markdown: str

    @property
    def slug(self) -> str:
        return self.meta["slug"].strip("/")

    @property
    def route(self) -> str:
        prefix = {
            "service": "servicios",
            "post": "conocimiento",
            "project": "proyectos",
            "case": "casos",
        }[self.kind]
        return f"/{prefix}/{self.slug}/"

    @property
    def output(self) -> Path:
        return ROOT / self.route.strip("/") / "index.html"


def parse_document(path: Path) -> Document:
    raw = path.read_text(encoding="utf-8")
    if not raw.startswith("---\n"):
        raise ValueError(f"{path}: falta el bloque inicial ---")
    _, frontmatter, markdown = raw.split("---\n", 2)
    meta: dict[str, str] = {}
    for number, line in enumerate(frontmatter.splitlines(), 1):
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if ":" not in line:
            raise ValueError(f"{path}:{number}: campo inválido")
        key, value = line.split(":", 1)
        meta[key.strip()] = value.strip().strip('"')
    for required in ("type", "slug", "title", "description", "h1"):
        if not meta.get(required):
            raise ValueError(f"{path}: falta {required}")
    return Document(path, meta["type"], meta, markdown.strip())


def inline(text: str) -> str:
    escaped = html.escape(text, quote=False)
    escaped = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", escaped)
    escaped = re.sub(r"`(.+?)`", r"<code>\1</code>", escaped)
    escaped = re.sub(r"\[(.+?)\]\((https?://[^)]+|/[^)]+)\)", r'<a href="\2">\1</a>', escaped)
    return escaped


def markdown_to_html(markdown: str) -> str:
    lines = markdown.splitlines()
    output: list[str] = []
    paragraph: list[str] = []
    list_type: str | None = None

    def flush_paragraph() -> None:
        if paragraph:
            output.append(f"<p>{inline(' '.join(paragraph))}</p>")
            paragraph.clear()

    def close_list() -> None:
        nonlocal list_type
        if list_type:
            output.append(f"</{list_type}>")
            list_type = None

    for raw in lines + [""]:
        line = raw.strip()
        if not line:
            flush_paragraph()
            close_list()
            continue
        heading = re.match(r"^(#{2,4})\s+(.+)$", line)
        if heading:
            flush_paragraph()
            close_list()
            level = len(heading.group(1))
            output.append(f"<h{level}>{inline(heading.group(2))}</h{level}>")
            continue
        bullet = re.match(r"^[-*]\s+(.+)$", line)
        numbered = re.match(r"^\d+\.\s+(.+)$", line)
        if bullet or numbered:
            flush_paragraph()
            wanted = "ul" if bullet else "ol"
            if list_type != wanted:
                close_list()
                output.append(f"<{wanted}>")
                list_type = wanted
            output.append(f"<li>{inline((bullet or numbered).group(1))}</li>")
            continue
        if line.startswith("> "):
            flush_paragraph()
            close_list()
            output.append(f"<blockquote>{inline(line[2:])}</blockquote>")
            continue
        paragraph.append(line)
    return "\n".join(output)


def split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def nav() -> str:
    return """<header class="site-header"><div class="container header-inner">
<a class="brand" href="/" aria-label="Inicio"><img class="brand-logo" src="/assets/img/logo-luisguacache-white.png" alt="" width="36" height="36"><span class="brand-text"><span class="brand-name">Luis Guacache</span><span class="brand-tag">Tecnología · Automatización · Contenido</span></span></a>
<nav class="nav" aria-label="Menú principal"><a href="/luis-guacache/">Quién soy</a><a href="/servicios/">Servicios</a><a href="/proyectos/">Proyectos</a><a href="/conocimiento/">Conocimiento</a><a class="btn btn-small" href="/#contacto">Contacto</a></nav>
</div></header>"""


def footer() -> str:
    return """<footer class="site-footer"><div class="container footer-inner"><small>© <span id="year"></span> Luis Guacache — Todos los derechos reservados</small><nav class="footer-nav" aria-label="Enlaces legales"><a href="/legal/aviso-legal.html">Aviso legal</a><a href="/legal/privacidad.html">Privacidad</a><a href="/legal/cookies.html">Cookies</a></nav></div></footer><script src="/assets/js/main.js?v=300" defer></script>"""


def breadcrumb(doc: Document) -> list[dict]:
    labels = {"service": "Servicios", "post": "Conocimiento", "project": "Proyectos", "case": "Casos"}
    prefixes = {"service": "servicios", "post": "conocimiento", "project": "proyectos", "case": "casos"}
    return [
        {"@type": "ListItem", "position": 1, "name": "Inicio", "item": f"{SITE_URL}/"},
        {"@type": "ListItem", "position": 2, "name": labels[doc.kind], "item": f"{SITE_URL}/{prefixes[doc.kind]}/"},
        {"@type": "ListItem", "position": 3, "name": doc.meta["title"], "item": f"{SITE_URL}{doc.route}"},
    ]


def structured_data(doc: Document) -> dict:
    base = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": {"service": "Service", "post": "Article", "project": "CreativeWork", "case": "Article"}[doc.kind],
                "@id": f"{SITE_URL}{doc.route}#primary",
                "name": doc.meta["title"],
                "headline": doc.meta["h1"],
                "description": doc.meta["description"],
                "url": f"{SITE_URL}{doc.route}",
                "inLanguage": "es-ES",
                "author": {"@id": f"{SITE_URL}/#person"},
            },
            {"@type": "BreadcrumbList", "itemListElement": breadcrumb(doc)},
        ],
    }
    primary = base["@graph"][0]
    if doc.kind == "service":
        primary["provider"] = {"@id": f"{SITE_URL}/#person"}
        primary["areaServed"] = split_csv(doc.meta.get("area", "Madrid, España, Remoto"))
    if doc.kind in {"post", "case"}:
        primary["datePublished"] = doc.meta.get("published", date.today().isoformat())
        primary["dateModified"] = doc.meta.get("updated", primary["datePublished"])
    return base


def render_document(doc: Document, all_docs: list[Document]) -> str:
    labels = {"service": "Servicio", "post": "Conocimiento", "project": "Proyecto", "case": "Caso real"}
    hubs = {"service": ("Servicios", "/servicios/"), "post": ("Conocimiento", "/conocimiento/"), "project": ("Proyectos", "/proyectos/"), "case": ("Casos", "/casos/")}
    related_slugs = split_csv(doc.meta.get("related", ""))
    related = [item for item in all_docs if item.slug in related_slugs and item.meta.get("draft", "false").lower() != "true"]
    related_html = "".join(f'<a href="{item.route}">{html.escape(item.meta["title"])}</a>' for item in related)
    title = f'{doc.meta["title"]} | Luis Guacache'
    canonical = f"{SITE_URL}{doc.route}"
    hub_label, hub_url = hubs[doc.kind]
    schema = json.dumps(structured_data(doc), ensure_ascii=False, indent=2)
    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0b0f19">
<title>{html.escape(title)}</title><meta name="description" content="{html.escape(doc.meta['description'], quote=True)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><link rel="canonical" href="{canonical}">
<meta property="og:type" content="{'article' if doc.kind in {'post','case'} else 'website'}"><meta property="og:locale" content="es_ES"><meta property="og:site_name" content="Luis Guacache"><meta property="og:title" content="{html.escape(title, quote=True)}"><meta property="og:description" content="{html.escape(doc.meta['description'], quote=True)}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{SITE_URL}/assets/img/og.jpg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png"><link rel="stylesheet" href="/assets/css/styles.css"><link rel="stylesheet" href="/assets/css/v14.css?v=151"><link rel="stylesheet" href="/assets/css/v2.css?v=300"><script type="application/ld+json">{schema}</script></head>
<body><a class="skip-link" href="#contenido">Saltar al contenido</a>{nav()}<main id="contenido"><div class="container breadcrumbs"><a href="/">Inicio</a> / <a href="{hub_url}">{hub_label}</a> / {html.escape(doc.meta['title'])}</div>
<section class="page-hero"><div class="container page-grid"><div><span class="eyebrow">{html.escape(doc.meta.get('eyebrow', labels[doc.kind]))}</span><h1>{html.escape(doc.meta['h1'])}</h1><p class="lead">{html.escape(doc.meta.get('lead', doc.meta['description']))}</p><div class="cta-row"><a class="btn" href="/#contacto">Consultar con Luis</a><a class="btn btn-outline" href="{hub_url}">Ver {hub_label.lower()}</a></div></div><aside class="sidebar-card"><h2>{html.escape(doc.meta.get('aside_title', 'Atención directa'))}</h2><p>{html.escape(doc.meta.get('aside', 'Cuéntame el contexto, el objetivo y la urgencia para evaluar la ruta adecuada.'))}</p><span class="pill">{html.escape(doc.meta.get('badge', 'Madrid · Remoto según el caso'))}</span></aside></div></section>
<section class="section section-alt"><div class="container content-grid"><article class="prose">{markdown_to_html(doc.markdown)}</article><aside class="sidebar-card"><h3>Contenido relacionado</h3><div class="related-links">{related_html or '<a href="/servicios/">Explorar servicios</a><a href="/proyectos/">Ver proyectos</a>'}</div></aside></div></section></main>{footer()}</body></html>"""


def render_index(kind: str, docs: list[Document]) -> str:
    config = {
        "service": ("Servicios de Luis Guacache", "Soluciones técnicas, digitales, creativas y de negocio", "Servicios organizados por problemas, objetivos y modalidad de atención.", "/servicios/"),
        "post": ("Conocimiento", "Guías y aprendizajes de Luis Guacache", "Contenido práctico sobre tecnología, negocios, automatización, soporte y producción digital.", "/conocimiento/"),
        "project": ("Proyectos", "Proyectos y ecosistema Luis G.", "Marcas, herramientas, experimentos y soluciones desarrolladas o impulsadas por Luis Guacache.", "/proyectos/"),
        "case": ("Casos reales", "Problemas, soluciones y resultados", "Casos publicados con autorización y evidencias suficientes.", "/casos/"),
    }
    title, h1, description, route = config[kind]
    cards = "".join(f'<a class="service-link" href="{doc.route}"><h2>{html.escape(doc.meta["title"])}</h2><p>{html.escape(doc.meta["description"])}</p><span>Ver {"servicio" if kind == "service" else "contenido"} →</span></a>' for doc in docs)
    canonical = f"{SITE_URL}{route}"
    schema = json.dumps({"@context":"https://schema.org","@type":"CollectionPage","name":title,"description":description,"url":canonical,"about":{"@id":f"{SITE_URL}/#person"}}, ensure_ascii=False)
    return f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} | Luis Guacache</title><meta name="description" content="{description}"><meta name="robots" content="index,follow"><link rel="canonical" href="{canonical}"><link rel="icon" href="/favicon.png"><link rel="stylesheet" href="/assets/css/styles.css"><link rel="stylesheet" href="/assets/css/v14.css?v=151"><link rel="stylesheet" href="/assets/css/v2.css?v=300"><script type="application/ld+json">{schema}</script></head><body>{nav()}<main id="contenido"><div class="container breadcrumbs"><a href="/">Inicio</a> / {title}</div><section class="page-hero"><div class="container"><span class="eyebrow">{title}</span><h1>{h1}</h1><p class="lead">{description}</p></div></section><section class="section section-alt"><div class="container"><div class="service-index">{cards}</div></div></section></main>{footer()}</body></html>"""


def load_documents() -> list[Document]:
    docs = [parse_document(path) for path in sorted(CONTENT.glob("**/*.md"))]
    slugs: set[tuple[str, str]] = set()
    for doc in docs:
        key = (doc.kind, doc.slug)
        if key in slugs:
            raise ValueError(f"Slug duplicado: {doc.kind}/{doc.slug}")
        slugs.add(key)
    return docs


def build() -> None:
    docs = load_documents()
    published = [doc for doc in docs if doc.meta.get("draft", "false").lower() != "true"]
    for doc in published:
        doc.output.parent.mkdir(parents=True, exist_ok=True)
        doc.output.write_text(render_document(doc, published), encoding="utf-8")
    for kind in ("service", "post", "project", "case"):
        items = [doc for doc in published if doc.kind == kind]
        if not items:
            continue
        route = {"service":"servicios", "post":"conocimiento", "project":"proyectos", "case":"casos"}[kind]
        output = ROOT / route / "index.html"
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(render_index(kind, items), encoding="utf-8")
    # Keep hand-authored public hubs in the sitemap even when they do not yet
    # have generated child documents.
    urls = {"/", "/luis-guacache/", "/proyectos/"}
    urls.update(doc.route for doc in published)
    for kind in {doc.kind for doc in published}:
        urls.add({"service":"/servicios/", "post":"/conocimiento/", "project":"/proyectos/", "case":"/casos/"}[kind])
    body = "\n".join(f"  <url><loc>{SITE_URL}{route}</loc></url>" for route in sorted(urls))
    (ROOT / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}\n</urlset>\n', encoding="utf-8")
    print(f"Generadas {len(published)} páginas de contenido y {len({doc.kind for doc in published})} índices.")


if __name__ == "__main__":
    build()
