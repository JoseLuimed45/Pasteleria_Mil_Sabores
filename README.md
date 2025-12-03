# Pastelería Mil Sabores

Monorepo con frontend en React (Vite + Bootstrap) y backend en Node.js (Express + SQLite) con autenticación JWT, roles (admin/usuario) y CRUD de productos.

## Requisitos
- Node.js 18+

## Instalación (Windows CMD)
```cmd
cd Pasteleria_Mil_Sabores
npm install --workspaces
```

## Ejecutar
- Backend (API en http://localhost:4000)
```cmd
npm run dev:backend
```
- Frontend (Web en http://localhost:5173)
```cmd
npm run dev:frontend
```
- Ambos a la vez (abre dos terminales)
```cmd
npm run dev
```

Usuario admin inicial:
- Email: `admin@pasteleria.com`
- Password: `admin123`

## Endpoints principales
- `POST /api/auth/login` — Login y token
- `POST /api/auth/register` — Registro usuario
- `GET /api/products` — Listar productos
- `POST /api/products` — Crear (solo admin)
- `PUT /api/products/:id` — Editar (solo admin)
- `DELETE /api/products/:id` — Borrar (solo admin)
- `GET /api/users` — Listar usuarios (solo admin)
- `PUT /api/users/:id/role` — Cambiar rol (solo admin)

## Notas
- BD se crea como `pasteleria.db` en la carpeta `backend/` al iniciar la API.
- Puedes cambiar `VITE_API_URL` en el frontend con un archivo `.env` si usas otro puerto.
