-- insertar roles predeterminados
insert ignore into roles (id, nombre) values 
  (1, 'ADMIN'),
  (2, 'USER');

-- insertar categorias iniciales de reporte
insert ignore into categorias_reporte (nombre, descripcion, icono) values
  ('agua', 'problemas relacionados con fuga, contaminacion o desabastecimiento de agua', 'droplet'),
  ('deforestacion', 'tala ilegal de arboles y perdida de areas verdes', 'tree'),
  ('basura', 'acumulacion de residuos, vertederos clandestinos y mala gestion de basura', 'trash-2'),
  ('contaminacion', 'emisiones de humo, ruido extremo o contaminacion del suelo o aire', 'wind'),
  ('otros', 'otros tipos de incidentes o afecciones ambientales comunitarias', 'alert-circle');

-- insertar recomendaciones iniciales
insert into recomendaciones (titulo, descripcion, categoria_impacto, accion_sugerida) values
  ('cierra el grifo mientras te cepillas', 'ahorra hasta 12 litros de agua por minuto evitando el desperdicio continuo.', 'agua', 'cierra la llave del agua durante el cepillado de dientes.'),
  ('optimiza el uso de la energia electrica', 'desconecta los dispositivos electronicos que no estes utilizando para evitar el consumo fantasma.', 'energia', 'desconecta cargadores y electrodomesticos sin uso.'),
  ('prioriza el transporte activo o colectivo', 'reducir el uso del vehiculo particular disminuye directamente la huella de carbono individual.', 'transporte', 'utiliza bicicleta, camina o usa transporte publico 2 dias a la semana.'),
  ('separa los residuos organicos e inorganicos', 'clasificar la basura facilita el reciclaje y disminuye la saturacion de vertederos.', 'residuos', 'instala contenedores diferenciados en casa para plastico, papel y organicos.');

-- insertar usuarios de prueba
insert ignore into usuarios (
  id,
  nombre,
  apellido,
  email,
  password_hash,
  rol_id,
  puntuacion_ambiental
) values
  (
    1,
    'administrador',
    'ecotrack',
    'admin@ecotrack.org',
    '$2b$10$X7yL3oR1pZ8aB9cD0eF1u.aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2u',
    1,
    100
  ),
  (
    2,
    'hansel',
    'usuario',
    'hansel@ecotrack.org',
    '$2b$10$X7yL3oR1pZ8aB9cD0eF1u.aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2u',
    2,
    50
  );
