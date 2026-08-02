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
│   ├── css/v14.css
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

### V3.0 — Contenidos editables y expansión por categorías

- Se añadió un generador estático sin dependencias externas.
- Los servicios, posts, proyectos y casos se redactan en Markdown dentro de `content/`.
- Se generan automáticamente páginas HTML, índices, enlaces relacionados, Schema.org y `sitemap.xml`.
- Los contenidos con `draft: true` no se publican ni aparecen en el sitemap.
- Se incorporaron soporte técnico, electrónica, ECU, desarrollo web, marketing y producción audiovisual.
- Se creó la sección `conocimiento/` con un primer artículo práctico.

## Crear un post sin tocar HTML

1. Copiar `content/posts/_plantilla.md` con un nombre nuevo.
2. Cambiar `slug`, `title`, `description`, `h1`, fechas y contenido.
3. Mantener `draft: true` mientras se trabaja.
4. Cambiar a `draft: false` cuando esté listo.
5. Generar y abrir la vista previa:

```powershell
powershell -ExecutionPolicy Bypass -File .\publicar.ps1 -Preview
```

La vista previa se abre en `http://localhost:8080`. El generador actualiza el HTML y el sitemap, pero no sube ni despliega nada por sí solo.

### V2.0 — Arquitectura de identidad y servicios

- Se creó un respaldo remoto previo en `backup/pre-upgrade-v1.4-2026-08-02`.
- Se replanteó la portada alrededor de la identidad canónica Luis Guacache.
- Se añadieron páginas para perfil, servicios, asistencia remota, automatización para negocios, recuperación de datos y proyectos.
- Se preparó una arquitectura ampliable para proyectos, casos reales, clientes autorizados y nuevas categorías.
- Se conectó Luis G. Tech Group como marca y ecosistema, sin declararla todavía como LLC.
- Se amplió el grafo de entidades, el sitemap, `llms.txt` y el despliegue de cPanel.
- Se corrigieron enlaces obsoletos de la navegación legal y el namespace del sitemap.

### V1.4 — Conversión visual y confianza

- Se ajustó el hero para ser más comercial y directo.
- Se redujeron los CTAs principales a WhatsApp y servicios.
- Se añadió bloque de señales de confianza: Madrid, remoto, trato directo y enfoque real.
- Se reorganizaron los servicios por intención: contenido, web, soporte técnico y proyectos digitales.
- Se añadió sección `Para quién trabajo`.
- Se añadió sección de proceso de trabajo en 4 pasos.
- Se añadió bloque de confianza con propuesta de valor.
- Se mejoró la sección Ecosistema Luis G.
- Se creó `assets/css/v14.css` para estilos comerciales sin tocar en exceso la base visual.

### V1.3-B2 — Pulido final de home

- Se restauraron acentos visibles en la home.
- Se corrigió el botón flotante de WhatsApp: vuelve a usar el logo SVG en lugar del texto `WA`.
- Se añadieron estilos específicos para el bloque de preguntas frecuentes.
- Se actualizó la documentación del proyecto.

### V1.3-B — SEO home, ecosistema y FAQ

- Se mejoró el SEO interno de `index.html`.
- Se amplió Schema.org con `WebSite`, `Person`, `ProfessionalService` y `FAQPage`.
- Se añadió sección visible de Ecosistema Luis G.
- Se añadió FAQ visible en la home.
- Se reforzaron CTAs y enlaces hacia contacto.
- Se añadieron enlaces a `llms.txt` y `humans.txt` en el footer.

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


## Publicar desde el navegador

La guía para crear posts, proyectos, casos y servicios directamente desde GitHub está en [PUBLICAR-DESDE-GITHUB.md](PUBLICAR-DESDE-GITHUB.md). Una acción automática genera el HTML, los índices y el sitemap en la rama del Pull Request.
