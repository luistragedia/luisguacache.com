# luisguacache.com

Web principal de Luis Guacache.

## Estructura

```text
.
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── humans.txt
├── llms.txt
├── favicon.png
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── img/
└── legal/
```

## Publicación

Flujo actual recomendado:

```text
GitHub main → cPanel Git™ Version Control → Update from Remote → Deploy HEAD Commit → public_html
```

No subir cambios directos a producción salvo emergencia. Para mejoras, usar ramas y Pull Request.

## Notas de versión

### V1.3-B — SEO home, ecosistema y FAQ

- Se mejoró el SEO interno de `index.html`.
- Se amplió Schema.org con `WebSite`, `Person`, `ProfessionalService` y `FAQPage`.
- Se añadió sección visible de Ecosistema Luis G.
- Se añadió FAQ visible en la home.
- Se reforzaron CTAs y enlaces hacia contacto.
- Se añadieron enlaces a `llms.txt` y `humans.txt` en el footer.
- Se restauraron acentos visibles y el logo SVG de WhatsApp flotante.

### V1.3-A — Archivos auxiliares SEO/IA

- Se añadió `404.html` para página de error personalizada.
- Se añadió `humans.txt` con información básica del sitio.
- Se añadió `llms.txt` como contexto para buscadores y agentes de IA.
- Se actualizó `.cpanel.yml` para desplegar los nuevos archivos auxiliares.
- Se configuró `.htaccess` manual en `public_html` para usar `/404.html` como error 404.

### V1.2 — Visual y móvil

- Se añadieron efectos hover sutiles en botones, tarjetas, badges, enlaces y foto principal.
- Se mejoró la sensación visual de profundidad sin recargar la web.
- Se optimizó la navegación en móvil con menú horizontal tipo chips.
- Se ajustaron hero, botones, tarjetas, WhatsApp flotante y banner de cookies para pantallas pequeñas.
- Se añadió soporte para usuarios con reducción de movimiento activada.

### V1.1 — Base limpia

- Versión limpia preparada para GitHub.
- Se eliminaron carpetas propias del hosting (`cgi-bin`, `.well-known`).
- Se optimizaron imágenes pesadas del hero y logotipo.
- Google Analytics se carga solo tras aceptar cookies de análisis.
- Se corrigieron textos legales básicos para no contradecir el uso de Analytics.
- Se retiró `dashboard.luisguacache.com` del sitemap principal.

## Prueba local

Antes de publicar, probar localmente:

```bash
python3 -m http.server 8080
```

Abrir:

```text
http://localhost:8080
```
