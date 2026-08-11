# luisguacache.com

Sitio web oficial de **Luis Guacache** y repositorio principal de su presencia digital.

La web funciona como identidad personal, escaparate profesional, centro de servicios, proyectos y conocimiento, y punto de conexión con el ecosistema **Luis G.**. Está diseñada para crecer de forma modular, mantener una base estática ligera y facilitar la publicación de nuevos contenidos sin editar HTML manualmente en cada página.

> Producción: https://luisguacache.com/

## Estado actual

Versión funcional actual: **V3**.

La arquitectura combina páginas HTML estáticas con un generador propio en Python. Servicios, artículos, proyectos y casos pueden redactarse en Markdown dentro de `content/`; `sitegen.py` procesa esos archivos y genera las páginas públicas, índices, datos estructurados y sitemap correspondientes.

Principios del proyecto:

- Código simple, estático y fácil de mantener.
- Sin framework web ni CMS externo como dependencia obligatoria.
- Contenido estructurado y ampliable mediante Markdown.
- SEO técnico y datos estructurados integrados.
- Preparación para buscadores tradicionales y agentes de IA.
- Desarrollo separado de producción mediante Git y ramas.
- Despliegue controlado desde GitHub hacia cPanel.

## Stack

- HTML5
- CSS3
- JavaScript vanilla
- Python 3 para generación estática
- Markdown + front matter para contenidos editables
- Schema.org / JSON-LD
- Git + GitHub
- cPanel Git™ Version Control
- PowerShell para generación y vista previa local en Windows

No se requieren Node.js, npm ni dependencias externas para generar el sitio actual.

## Arquitectura del repositorio

```text
.
├── index.html                  # Home principal
├── 404.html                    # Error 404 personalizado
├── favicon.png
├── robots.txt
├── sitemap.xml
├── humans.txt
├── llms.txt                    # Contexto semántico para agentes de IA
├── sitegen.py                  # Generador estático del contenido
├── publicar.ps1                # Generación + vista previa local
├── .cpanel.yml                 # Despliegue hacia producción
├── .gitignore
├── assets/
│   ├── css/
│   ├── js/
│   └── img/
├── content/
│   ├── services/               # Fuentes Markdown de servicios
│   ├── posts/                  # Artículos / conocimiento
│   ├── projects/               # Proyectos
│   └── cases/                  # Casos reales
├── luis-guacache/              # Perfil profesional
├── servicios/                  # HTML público generado / mantenido
├── conocimiento/               # Artículos públicos
├── proyectos/                  # Proyectos públicos
├── casos/                      # Casos públicos cuando existan
└── legal/                      # Aviso legal, privacidad y cookies
```

La estructura puede crecer con nuevas categorías sin convertir la raíz del proyecto en un conjunto desordenado de páginas independientes.

## Sistema de contenidos

El contenido dinámicamente generable vive en `content/`.

Tipos soportados por `sitegen.py`:

| Tipo | Fuente | Salida pública |
|---|---|---|
| `service` | `content/services/` | `/servicios/<slug>/` |
| `post` | `content/posts/` | `/conocimiento/<slug>/` |
| `project` | `content/projects/` | `/proyectos/<slug>/` |
| `case` | `content/cases/` | `/casos/<slug>/` |

Cada documento utiliza front matter. Ejemplo simplificado:

```md
---
type: post
slug: ejemplo
title: Título del contenido
description: Descripción SEO.
h1: Título principal
lead: Introducción breve.
published: 2026-08-11
updated: 2026-08-11
related: asistencia-remota, soporte-tecnico
draft: true
---

## Introducción

Contenido en Markdown.
```

Campos obligatorios actuales:

```text
type
slug
title
description
h1
```

Los documentos con:

```text
draft: true
```

no se publican ni se incluyen en el sitemap generado.

## Crear un nuevo artículo

1. Copiar la plantilla:

```text
content/posts/_plantilla.md
```

2. Renombrarla con un nombre descriptivo.
3. Editar `slug`, `title`, `description`, `h1`, fechas y contenido.
4. Mantener `draft: true` mientras esté en preparación.
5. Cambiar a `draft: false` cuando el contenido esté listo.
6. Generar y revisar el sitio localmente.

El mismo principio se aplica a servicios, proyectos y casos utilizando sus respectivas carpetas y plantillas.

## Generar el sitio

Desde PowerShell en la raíz del repositorio:

```powershell
powershell -ExecutionPolicy Bypass -File .\publicar.ps1
```

Esto ejecuta `sitegen.py` y actualiza los HTML generados y el sitemap.

El generador no publica cambios en GitHub ni despliega producción por sí solo.

## Vista previa local

Generación + servidor local:

```powershell
powershell -ExecutionPolicy Bypass -File .\publicar.ps1 -Preview
```

Abrir:

```text
http://localhost:8080
```

Alternativamente, para revisar únicamente archivos ya generados:

```bash
python3 -m http.server 8080
```

## SEO, datos estructurados e IA

La arquitectura actual contempla varias capas de descubrimiento:

- `sitemap.xml`
- `robots.txt`
- URLs canónicas
- meta descriptions
- Open Graph
- Schema.org mediante JSON-LD
- Breadcrumbs estructurados
- `humans.txt`
- `llms.txt`
- estructura semántica por servicios, conocimiento, proyectos y casos

`sitegen.py` genera datos estructurados específicos según el tipo de contenido, incluyendo `Service`, `Article`, `CreativeWork`, `BreadcrumbList` y páginas de colección.

`llms.txt` aporta contexto explícito sobre identidad, servicios, ubicación, modalidad de trabajo y ecosistema para sistemas y agentes de IA que utilicen este tipo de recurso.

## Flujo Git recomendado

`main` representa la versión estable preparada para producción.

Para cambios normales:

```text
main
  └── feature/... | fix/... | docs/...
          ↓
       pruebas
          ↓
     Pull Request
          ↓
        main
```

Antes de modificar código localmente:

```bash
git status -sb
```

Después de los cambios:

```bash
git diff
```

Usar commits descriptivos, por ejemplo:

```text
feat: añadir nueva sección de servicios
fix: corregir navegación móvil
docs: actualizar documentación del proyecto
refactor: simplificar generador de contenidos
```

No se recomienda editar producción directamente salvo una emergencia justificada.

## Despliegue

Flujo actual:

```text
Rama de trabajo
      ↓
Pull Request
      ↓
main en GitHub
      ↓
cPanel Git™ Version Control
      ↓
Update from Remote
      ↓
Deploy HEAD Commit
      ↓
public_html
```

`.cpanel.yml` copia a producción los archivos públicos necesarios, entre ellos:

- Home y páginas auxiliares.
- `favicon.png`.
- `robots.txt` y `sitemap.xml`.
- `humans.txt` y `llms.txt`.
- `assets/`.
- `legal/`.
- perfil, servicios, proyectos y conocimiento.

Antes de un cambio importante en producción conviene mantener una rama o referencia de respaldo verificable.

## Seguridad y secretos

No deben almacenarse credenciales, claves API, contraseñas ni tokens dentro del repositorio.

`.gitignore` excluye actualmente, entre otros:

```text
.env
node_modules/
.vscode/
*.log
```

Los secretos deben manejarse mediante variables de entorno o configuración local no versionada.

## Ecosistema

`luisguacache.com` es la identidad principal desde la que se conectan servicios, contenido y proyectos del ecosistema profesional de Luis Guacache.

Actualmente la web contempla, entre otros:

- Asistencia remota.
- Soporte técnico.
- Recuperación de datos.
- Automatización para negocios.
- Desarrollo web y presencia digital.
- Marketing y consultoría.
- Producción audiovisual.
- Electrónica, microelectrónica y ECU.
- Proyectos y herramientas digitales del ecosistema Luis G.

Luis G. Tech Group se mantiene identificado en la web como marca y ecosistema tecnológico, sin atribuirle una forma societaria no constituida.

## Roadmap técnico

Líneas naturales de evolución del proyecto:

- Ampliar la biblioteca de contenidos y casos reales.
- Seguir mejorando SEO semántico y visibilidad para buscadores con IA.
- Consolidar componentes compartidos para reducir duplicación HTML.
- Mejorar automatización de validaciones antes de publicar.
- Incorporar comprobaciones automáticas de enlaces, sitemap y estructura.
- Mantener documentación sincronizada con cada cambio de arquitectura.
- Evaluar un CMS o panel editorial únicamente cuando el volumen de contenido lo justifique, manteniendo compatibilidad con la estructura existente.

## Historial de versiones

### V3.0 — Sistema de contenidos y expansión por categorías

- Generador estático propio sin dependencias externas.
- Servicios, posts, proyectos y casos redactables en Markdown.
- Generación automática de páginas, índices, enlaces relacionados, Schema.org y sitemap.
- Soporte de borradores mediante `draft: true`.
- Nuevas categorías de servicios y sección de conocimiento.

### V2.0 — Arquitectura de identidad y servicios

- Replanteamiento de la portada alrededor de la identidad Luis Guacache.
- Arquitectura ampliable para servicios, proyectos, casos y nuevas categorías.
- Integración del ecosistema Luis G. Tech Group.
- Ampliación de SEO, grafo de entidades, sitemap y `llms.txt`.

### V1.4 — Conversión visual y confianza

- Hero más comercial.
- Reorganización de servicios por intención.
- Señales de confianza, proceso de trabajo y mejoras visuales.

### V1.3 — SEO, ecosistema y archivos auxiliares

- Schema.org ampliado.
- FAQ y ecosistema visibles.
- `404.html`, `humans.txt` y `llms.txt`.
- Mejoras de navegación y enlaces legales.

### V1.2 — Visual y móvil

- Hover, profundidad visual y mejoras responsive.
- Navegación móvil optimizada.
- Mejoras de accesibilidad relacionadas con movimiento reducido.

### V1.1 — Base limpia

- Preparación inicial para GitHub.
- Limpieza de archivos propios del hosting.
- Optimización de recursos y configuración inicial de Analytics/cookies.

---

**Repositorio:** `luistragedia/luisguacache.com`  
**Sitio:** https://luisguacache.com/
