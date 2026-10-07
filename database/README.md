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

## Ejecución

1. Crear la base de datos local.
2. Ejecutar la migración:
   mysql -u root -p < database/migrations/001_initial_schema.sql
3. Ejecutar las semillas:
   mysql -u root -p < database/seeds/001_initial_data.sql

## Convenciones

- Se usa MySQL para mantener la configuración del proyecto actual.
- Las ubicaciones geográficas se almacenan con latitud y longitud.
- Los datos iniciales son de demostración y deben reemplazarse en producción.

## Usuarios de demostración

- admin@ecotrack.com
- usuario@ecotrack.com

> Las contraseñas reales no se almacenan en este repositorio. En entorno real deben reemplazarse por hashes válidos y seguros.
