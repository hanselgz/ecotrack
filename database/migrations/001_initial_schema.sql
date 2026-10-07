drop database if exists ecotrack_db_in5bm;

create database if not exists ecotrack_db_in5bm;

use ecotrack_db_in5bm;

-- 1. tabla: roles
create table if not exists roles (
    id int auto_increment primary key,
    nombre varchar(20) not null unique
);

-- 2. tabla: usuarios
create table if not exists usuarios (
    id int auto_increment primary key,
    nombre varchar(100) not null,
    apellido varchar(100) not null,
    email varchar(150) not null unique,
    password_hash varchar(255) not null,
    rol_id int not null,
    puntuacion_ambiental int default 0,
    fecha_registro timestamp default current_timestamp,
    foreign key (rol_id) references roles(id) on delete restrict,
    index idx_usuarios_email (email)
);

-- 3. tabla: categorias de reporte
create table if not exists categorias_reporte (
    id int auto_increment primary key,
    nombre varchar(50) not null unique,
    descripcion text,
    icono varchar(50)
);

-- 4. tabla: ubicaciones
create table if not exists ubicaciones (
    id int auto_increment primary key,
    departamento varchar(100) not null,
    municipio varchar(100) not null,
    direccion text,
    referencia text,
    latitud decimal(10,8) not null,
    longitud decimal(11,8) not null,
    index idx_ubicaciones_coords (latitud, longitud)
);

-- 5. tabla: reportes ambientales
create table if not exists reportes_ambientales (
    id int auto_increment primary key,
    titulo varchar(150) not null,
    descripcion text not null,
    fotografia varchar(255),
    estado enum(
        'pendiente',
        'en revision',
        'verificado',
        'resuelto',
        'rechazado'
    ) default 'pendiente',
    nivel_impacto enum(
        'bajo',
        'medio',
        'alto',
        'critico'
    ) default 'bajo',
    observaciones_evaluacion text null,
    usuario_id int not null,
    categoria_id int not null,
    ubicacion_id int not null,
    fecha_creacion timestamp default current_timestamp,
    fecha_actualizacion timestamp default current_timestamp on update current_timestamp,
    foreign key (usuario_id) references usuarios(id) on delete cascade,
    foreign key (categoria_id) references categorias_reporte(id) on delete restrict,
    foreign key (ubicacion_id) references ubicaciones(id) on delete cascade,
    index idx_reportes_usuario (usuario_id),
    index idx_reportes_categoria (categoria_id),
    index idx_reportes_estado (estado)
);

-- 6. tabla: evaluaciones de impacto
create table if not exists evaluaciones_impacto (
    id int auto_increment primary key,
    usuario_id int not null,
    transporte_tipo varchar(50) not null,
    transporte_distancia decimal(8,2) not null,
    energia_kwh decimal(8,2) not null,
    agua_litros decimal(8,2) not null,
    residuos_kg decimal(8,2) not null,
    huella_carbono_kg decimal(8,2) not null,
    puntuacion_calculada int not null,
    fecha_evaluacion timestamp default current_timestamp,
    foreign key (usuario_id) references usuarios(id) on delete cascade
);

-- 7. tabla: recomendaciones
create table if not exists recomendaciones (
    id int auto_increment primary key,
    titulo varchar(150) not null,
    descripcion text not null,
    categoria_impacto enum(
        'transporte',
        'energia',
        'agua',
        'residuos',
        'general'
    ) not null,
    accion_sugerida text not null
);

-- 8. tabla: notificaciones
create table if not exists notificaciones (
    id int auto_increment primary key,
    usuario_id int not null,
    titulo varchar(150) not null,
    mensaje text not null,
    leida boolean default false,
    fecha_creacion timestamp default current_timestamp,
    foreign key (usuario_id) references usuarios(id) on delete cascade,
    index idx_notificaciones_usuario (usuario_id, leida)
);