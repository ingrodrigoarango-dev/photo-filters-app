PhotoFilters

Proyecto dividido en dos aplicaciones activas:

- `frontend/`: interfaz Next.js
- `backend/`: API Express + SQLite para guardar y listar imágenes

Artefactos legacy en la raíz:

- `index.html`
- `app.js`
- `styles.css`
- `server.js`

Esos archivos se conservan como referencia del prototipo inicial, pero el flujo principal del proyecto ahora vive en `frontend/` y `backend/`.

Uso local:

1. En `backend/`, copiar `.env.example` si necesitas personalizar puertos o rutas y ejecutar `npm install` seguido de `npm test` o `npm run dev`.
2. En `frontend/`, copiar `.env.example` si necesitas apuntar a otra API y ejecutar `npm install` seguido de `npm run dev`.
