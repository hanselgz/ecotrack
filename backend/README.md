# Backend EcoTrack

API REST de EcoTrack construida con Node.js, Express y TypeScript. La persistencia usa MySQL mediante `mysql2/promise`.

## Arquitectura

El código fuente vive en `src/` y está dividido por responsabilidad:

- `routes/`: registra métodos HTTP y los conecta con controladores.
- `controllers/`: valida parámetros básicos y forma las respuestas HTTP.
- `services/`: aplica validaciones y reglas de negocio.
- `models/`: ejecuta consultas MySQL.
- `middlewares/`: manejo de errores y utilidades de autenticación/autorización.
- `config/db.ts`: configura el pool de conexiones MySQL.
- `utils/`: funciones compartidas de respuesta.

El flujo habitual es `ruta → controlador → servicio → modelo`. `src/app.ts` registra las rutas bajo `/api`; `src/server.ts` prueba la conexión con MySQL e inicia Express.

## Requisitos y configuración

- Node.js compatible con las versiones de TypeScript y las dependencias del proyecto.
- pnpm 10.29.2.
- MySQL 8 o superior.

Crea `backend/.env` antes de iniciar el servidor. Puedes partir de `.env.example` en la raíz del repositorio. Variables que consume el backend:

| Variable | Uso | Valor predeterminado |
| --- | --- | --- |
| `PORT` | Puerto HTTP | `3000` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USER` | Usuario MySQL | `root` |
| `DB_PASSWORD` | Contraseña MySQL | vacío |
| `DB_NAME` | Base de datos | `ecotrack_db` |
| `JWT_SECRET` | Firma de tokens | `secret_key` (solo fallback de desarrollo; define uno privado) |
| `FRONTEND_URL` | Origen CORS del frontend | Permite cualquier origen si no se define |

**Nombre de la base:** la migración y las semillas actuales usan `ecotrack_db_in5bm`, mientras que el fallback del backend es `ecotrack_db`. El `.env.example` está alineado con los scripts SQL. Mantén `DB_NAME` de `backend/.env` igual al nombre real creado por la migración.

La migración `database/migrations/001_initial_schema.sql` elimina y recrea esa base. Es destructiva: úsala solo en un entorno local desechable o después de un respaldo. Los hashes incluidos en las semillas son placeholders de demostración; sustitúyelos por hashes válidos si necesitas probar inicio de sesión.

## Instalar, ejecutar y compilar

Desde la carpeta `backend/`:

```bash
pnpm install
pnpm run dev
```

El servidor queda en `http://localhost:3000` por defecto. Para compilar y ejecutar la salida de producción:

```bash
pnpm run build
pnpm start
```

`tsconfig.json` limita las fuentes a `src/**/*.ts` y emite JavaScript bajo `backend/dist/`; no genera JavaScript, mapas ni declaraciones dentro de `src/`.

El servidor intenta conectar con MySQL al arrancar. Si la conexión falla, registra una advertencia y continúa levantado, pero los endpoints que consultan la base no estarán operativos hasta corregir la configuración.

## API

Base local predeterminada: `http://localhost:3000`. La mayoría de las respuestas usan `{ "success": boolean, "message": string, "data": ... }`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Registra un usuario. |
| `POST` | `/api/auth/login` | Inicia sesión y devuelve un JWT. |
| `GET` | `/api/auth/profile` | Obtiene el perfil; actualmente la ruta no monta `authenticateToken`, aunque el controlador necesita `req.user`, por lo que responde 401 si no se inyecta ese contexto. |
| `GET` | `/api/reportes-ambientales` | Lista reportes. |
| `GET` | `/api/reportes-ambientales/stats` | Devuelve estadísticas agregadas. |
| `GET` | `/api/reportes-ambientales/:id` | Obtiene un reporte. |
| `POST` | `/api/reportes-ambientales` | Crea un reporte con categoría y ubicación. La ubicación requiere departamento, municipio, latitud y longitud; dirección y referencia son opcionales. |
| `PATCH` | `/api/reportes-ambientales/:id/estado` | Actualiza el estado. Valores admitidos: `pendiente`, `en revision`, `verificado`, `resuelto`, `rechazado`. |
| `POST` | `/api/reportes-ambientales/:id/evaluacion` | Registra nivel de impacto y observaciones. |
| `DELETE` | `/api/reportes-ambientales/:id` | Elimina un reporte. |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/recomendaciones` | Consulta y administra recomendaciones. |
| `GET`, `POST`, `PUT`, `DELETE` | `/api/categorias` | Consulta y administra categorías de reporte. |
| `POST` | `/api/impacto` | Calcula una evaluación de impacto a partir de hábitos enviados en el cuerpo. |

También están registradas la ruta `/api/recommendations` como alias de recomendaciones y las rutas `/api/categories` y `/api/categoria` para categorías.

**Autenticación:** registro e inicio de sesión devuelven un token firmado con `JWT_SECRET`. El middleware `authenticateToken` valida `Authorization: Bearer <token>`, pero revisa qué rutas lo aplican en `src/routes/` antes de considerar un endpoint protegido.

## Pruebas

No hay actualmente una suite de pruebas automatizadas propia para el backend. El chequeo disponible es:

```bash
pnpm run build
```

Desde `frontend/` se ejecutan las pruebas Angular con `pnpm test`.
