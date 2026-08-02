# Publicar contenido desde GitHub

Este es el flujo recomendado para crear posts sin instalar programas, ejecutar comandos ni editar HTML.

## Crear un post

1. Abre la carpeta `content/posts` en GitHub.
2. Abre `_plantilla.md`.
3. Pulsa el menú de tres puntos y selecciona **Copy file contents**, o abre el archivo y copia su contenido.
4. Regresa a `content/posts` y selecciona **Add file → Create new file**.
5. Escribe un nombre terminado en `.md`, por ejemplo: `como-elegir-un-ordenador.md`.
6. Pega la plantilla y modifica sus campos y el contenido.
7. Mantén `draft: true` si todavía no quieres publicarlo.
8. Cuando esté listo, cambia a `draft: false`.
9. Pulsa **Commit changes…**.
10. Selecciona **Create a new branch for this commit and start a pull request**.
11. Confirma con **Propose changes** y crea el Pull Request.

GitHub generará automáticamente:

- la página HTML del artículo;
- el índice de `/conocimiento/`;
- los enlaces relacionados;
- los datos estructurados;
- el sitemap.

El proceso normalmente tarda menos de un minuto. Dentro del Pull Request aparecerá un nuevo commit llamado **Generar contenido web**.

## Campos principales

- `slug`: dirección del artículo, en minúsculas, sin espacios ni tildes.
- `title`: título para Google y para el listado.
- `description`: resumen descriptivo de aproximadamente 140–160 caracteres.
- `h1`: encabezado principal visible.
- `lead`: introducción breve.
- `category`: categoría editorial.
- `published`: fecha inicial con formato AAAA-MM-DD.
- `updated`: fecha de la última actualización.
- `related`: slugs de servicios relacionados, separados por comas.
- `draft`: `true` oculta el contenido; `false` lo publica.

## Revisar y desplegar

1. Espera a que termine la acción **Generar contenido web**.
2. Revisa los archivos cambiados en el Pull Request.
3. Fusiona el Pull Request.
4. En cPanel ejecuta **Update from Remote**.
5. Ejecuta **Deploy HEAD Commit**.
6. Abre el artículo publicado y comprueba el sitemap.

## Actualizar un post existente

Abre su archivo dentro de `content/posts`, pulsa el lápiz, actualiza el texto y la fecha `updated`, y guarda el cambio en una rama nueva. El resto del proceso es automático.

## Otros contenidos

El mismo sistema admite:

- `content/projects/` para proyectos;
- `content/cases/` para casos reales;
- `content/services/` para páginas de servicios.

Conviene partir siempre de la plantilla correspondiente y publicar mediante una rama y un Pull Request.
