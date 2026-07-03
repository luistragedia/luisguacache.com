# luisguacache.com

Web principal de Luis Guacache.

## Estructura

```text
.
├── index.html
├── robots.txt
├── sitemap.xml
├── favicon.png
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── img/
└── legal/
```

## Notas de esta versión

- Versión limpia preparada para GitHub.
- Se eliminaron carpetas propias del hosting (`cgi-bin`, `.well-known`).
- Se optimizaron imágenes pesadas del hero y logotipo.
- Google Analytics se carga solo tras aceptar cookies de análisis.
- Se corrigieron textos legales básicos para no contradecir el uso de Analytics.
- Se retiró `dashboard.luisguacache.com` del sitemap principal.

## Publicación manual

Subir el contenido de esta carpeta al `public_html` del hosting.

Antes de publicar, probar localmente:

```bash
python3 -m http.server 8080
```

Abrir: `http://localhost:8080`
