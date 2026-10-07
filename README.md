# EcoTrack

EcoTrack es una aplicación web de participación ciudadana para registrar reportes ambientales, consultar recomendaciones y revisar estadísticas.

## Arquitectura

- `frontend/`: SPA con Angular, TypeScript y componentes standalone.
- `backend/`: API REST con Node.js, Express y TypeScript.
- `database/`: migración y datos iniciales para MySQL.

El frontend y el backend son aplicaciones separadas, cada una con su propio `package.json` y lockfile. La API usa MySQL mediante `mysql2`.

## Requisitos

- Node.js compatible con Angular CLI 22.
- pnpm 10.29.2 (versión declarada en los paquetes del frontend y backend).
- MySQL 8 o superior.

## Configuración local

1. Configura MySQL siguiendo [database/README.md](database/README.md). La migración actual elimina y recrea `ecotrack_db_in5bm`; ejecútala solo en un entorno local desechable o después de respaldar cualquier dato importante.
2. Copia `.env.example` a `backend/.env` y ajusta las credenciales locales. El `DB_NAME` del ejemplo corresponde al nombre utilizado por los scripts SQL.
3. Instala e inicia el backend en una terminal:

   ```bash
   cd backend
   pnpm install
   pnpm run dev
   ```

   La API escucha por defecto en `http://localhost:3000`.
4. Instala e inicia Angular en otra terminal:

   ```bash
   cd frontend
   pnpm install
   pnpm start
   ```

   Angular sirve la aplicación por defecto en `http://localhost:4200`. Configura `FRONTEND_URL` en `backend/.env` para que coincida si utilizas otro origen o puerto.

## Comandos

Desde `frontend/`:

- `pnpm start`: servidor Angular de desarrollo.
- `pnpm run build`: build de producción en `frontend/dist/`.
- `pnpm test`: pruebas frontend con Vitest.

Desde `backend/`:

- `pnpm run dev`: servidor con recarga durante el desarrollo.
- `pnpm run build`: compila TypeScript en `backend/dist/`.
- `pnpm start`: inicia el backend compilado.

## Documentación relacionada

- [Backend: configuración y API](backend/README.md)
- [Base de datos: migración y semillas](database/README.md)
- [Frontend: Angular CLI](frontend/README.md)

La API devuelve respuestas con la forma `{ "success": boolean, "message": string, "data": ... }`. Consulta la guía del backend para sus rutas y observaciones de implementación.