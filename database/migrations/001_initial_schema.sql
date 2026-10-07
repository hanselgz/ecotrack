DROP DATABASE IF EXISTS ecotrack_db_in5bm;
CREATE DATABASE ecotrack_db_in5bm;
USE ecotrack_db_in5bm;

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    puntuacion_ambiental INT NOT NULL DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_roles
        FOREIGN KEY (rol_id) REFERENCES roles(id)
        ON DELETE RESTRICT,
    INDEX idx_usuarios_email (email),
    INDEX idx_usuarios_rol_id (rol_id)
);

CREATE TABLE IF NOT EXISTS categorias_reporte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ubicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departamento VARCHAR(100) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    direccion TEXT,
    referencia TEXT,
    latitud DECIMAL(10,8) NOT NULL,
    longitud DECIMAL(11,8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ubicaciones_coords (latitud, longitud)
);

CREATE TABLE IF NOT EXISTS reportes_ambientales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    fotografia TEXT,
    estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
    nivel_impacto VARCHAR(20) NOT NULL DEFAULT 'Bajo',
    observaciones_evaluacion TEXT,
    usuario_id INT NOT NULL,
    categoria_id INT NOT NULL,
    ubicacion_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reportes_usuarios
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reportes_categorias
        FOREIGN KEY (categoria_id) REFERENCES categorias_reporte(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_reportes_ubicaciones
        FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id)
        ON DELETE CASCADE,
    INDEX idx_reportes_usuario (usuario_id),
    INDEX idx_reportes_categoria (categoria_id),
    INDEX idx_reportes_estado (estado),
    INDEX idx_reportes_fecha (fecha_creacion)
);

CREATE TABLE IF NOT EXISTS evaluaciones_impacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    transporte_tipo VARCHAR(50) NOT NULL,
    transporte_distancia DECIMAL(10,2) NOT NULL DEFAULT 0,
    energia_kwh DECIMAL(10,2) NOT NULL DEFAULT 0,
    agua_litros DECIMAL(10,2) NOT NULL DEFAULT 0,
    residuos_kg DECIMAL(10,2) NOT NULL DEFAULT 0,
    huella_carbono_kg DECIMAL(10,2) NOT NULL DEFAULT 0,
    puntuacion_ambiental INT NOT NULL DEFAULT 0,
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evaluaciones_usuarios
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE,
    INDEX idx_evaluaciones_usuario (usuario_id)
);

CREATE TABLE IF NOT EXISTS recomendaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria_impacto VARCHAR(40) NOT NULL,
    accion_sugerida TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_recomendaciones_categoria (categoria_impacto)
);

CREATE TABLE IF NOT EXISTS notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notificaciones_usuarios
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE,
    INDEX idx_notificaciones_usuario (usuario_id, leida)
);