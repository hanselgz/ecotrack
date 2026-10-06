-- Habilitar extensión PostGIS para coordenadas geográficas
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Tabla: Roles
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(20) NOT NULL UNIQUE
);

-- 2. Tabla: Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  puntuacion_ambiental INT DEFAULT 0,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla: Categorías de Reporte
CREATE TABLE IF NOT EXISTS categorias_reporte (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  icono VARCHAR(50)
);

-- 4. Tabla: Ubicaciones
CREATE TABLE IF NOT EXISTS ubicaciones (
  id SERIAL PRIMARY KEY,
  departamento VARCHAR(100) NOT NULL,
  municipio VARCHAR(100) NOT NULL,
  direccion TEXT,
  referencia TEXT,
  latitud NUMERIC(10, 8) NOT NULL,
  longitud NUMERIC(11, 8) NOT NULL,
  geom GEOMETRY(Point, 4326)
);

-- 5. Tabla: Reportes Ambientales
CREATE TABLE IF NOT EXISTS reportes_ambientales (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  fotografia VARCHAR(255),
  estado VARCHAR(30) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En revisión', 'Verificado', 'Resuelto', 'Rechazado')),
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  categoria_id INT NOT NULL REFERENCES categorias_reporte(id) ON DELETE RESTRICT,
  ubicacion_id INT NOT NULL REFERENCES ubicaciones(id) ON DELETE CASCADE,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabla: Evaluaciones de Impacto
CREATE TABLE IF NOT EXISTS evaluaciones_impacto (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  transporte_tipo VARCHAR(50) NOT NULL,
  transporte_distancia NUMERIC(8, 2) NOT NULL,
  energia_kwh NUMERIC(8, 2) NOT NULL,
  agua_litros NUMERIC(8, 2) NOT NULL,
  residuos_kg NUMERIC(8, 2) NOT NULL,
  huella_carbono_kg NUMERIC(8, 2) NOT NULL,
  puntuacion_calculada INT NOT NULL,
  fecha_evaluacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabla: Recomendaciones
CREATE TABLE IF NOT EXISTS recomendaciones (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  categoria_impacto VARCHAR(50) NOT NULL CHECK (categoria_impacto IN ('Transporte', 'Energía', 'Agua', 'Residuos', 'General')),
  accion_sugerida TEXT NOT NULL
);

-- 8. Tabla: Notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(150) NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Creación de Índices para optimizar búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_reportes_usuario ON reportes_ambientales(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reportes_categoria ON reportes_ambientales(categoria_id);
CREATE INDEX IF NOT EXISTS idx_reportes_estado ON reportes_ambientales(estado);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_geom ON ubicaciones USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id, leida);
