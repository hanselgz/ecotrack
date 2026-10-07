-- INSERCIÓN DE DATOS INICIALES (SEEDS)

-- Insertar roles iniciales
insert into roles (id, nombre) values 
(1, 'admin'),
(2, 'ciudadano');

-- Insertar usuario inicial de prueba (id: 1)
insert into usuarios (id, nombre, apellido, email, password_hash, rol_id) values 
(1, 'Usuario', 'Demo', 'demo@ecotrack.com', '$2b$10$e83p3G1O/32a1s1d3f4g5h6j7k8l9m0', 1);

-- Insertar categorias de reporte iniciales (id: 1, 2, 3)
insert into categorias_reporte (id, nombre, descripcion, icono) values 
(1, 'Contaminacion de Agua', 'Desechos o vertidos en rios o fuentes de agua', 'water_drop'),
(2, 'Acumulacion de Basura', 'Desechos solidos acumulados en la via publica', 'delete'),
(3, 'Deforestacion', 'Tala ilegal de arboles o destruccion de vegetacion', 'park');