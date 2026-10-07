# Base de datos de EcoTrack

## Objetivo

Esta carpeta contiene la estructura inicial de EcoTrack en MySQL, junto con semillas para demostrar el funcionamiento del sistema.

## Entidades principales

- Rol
- Usuario
- CategoriaReporte
- Ubicacion
- ReporteAmbiental
- EvaluacionImpacto
- Recomendacion
- Notificacion

## Requisitos

- MySQL 8 o superior

La migración y las semillas usan la base `ecotrack_db_in5bm`. Configura `DB_NAME=ecotrack_db_in5bm` en `backend/.env` para que el backend se conecte a esa misma base. El valor de `.env.example` ya coincide.

> **Advertencia:** `001_initial_schema.sql` ejecuta `DROP DATABASE IF EXISTS` y vuelve a crear la base. Esto elimina todos los datos que ya existan allí. Úsala solo para una instalación local desechable o después de crear un respaldo.

## Ejecución

1. Ejecutar la migración desde la raíz del repositorio:
   mysql -u root -p < database/migrations/001_initial_schema.sql
2. Cargar los datos de demostración:
   mysql -u root -p < database/seeds/001_initial_data.sql
3. Configurar `backend/.env` con el mismo nombre de base y las credenciales de MySQL.

## Convenciones

- Se usa MySQL para mantener la configuración del proyecto actual.
- Las ubicaciones geográficas se almacenan con latitud y longitud.
- Los datos iniciales son de demostración y deben reemplazarse en producción.

## Usuarios de demostración

- admin@ecotrack.com
- usuario@ecotrack.com

> Los hashes de contraseña de las semillas son placeholders de demostración, no credenciales utilizables. Para probar autenticación, reemplázalos por hashes válidos; nunca guardes contraseñas reales en el repositorio.
