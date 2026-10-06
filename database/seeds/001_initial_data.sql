-- Insertar Roles predeterminados
INSERT INTO roles (id, nombre) VALUES 
  (1, 'ADMIN'),
  (2, 'USER')
ON CONFLICT (id) DO NOTHING;

-- Insertar Categorias Iniciales de Reporte
INSERT INTO categorias_reporte (nombre, descripcion, icono) VALUES
  ('Agua', 'Problemas relacionados con fuga, contaminacion o desabastecimiento de agua', 'droplet'),
  ('Deforestacion', 'Tala ilegal de arboles y perdida de areas verdes', 'tree'),
  ('Basura', 'Acumulacion de residuos, vertederos clandestinos y mala gestion de basura', 'trash-2'),
  ('Contaminacion', 'Emisiones de humo, ruido extremo o contaminacion del suelo/aire', 'wind'),
  ('Otros', 'Otros tipos de incidentes o afecciones ambientales comunitarias', 'alert-circle')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar Recomendaciones Iniciales
INSERT INTO recomendaciones (titulo, descripcion, categoria_impacto, accion_sugerida) VALUES
  ('Cierra el grifo mientras te cepillas', 'Ahorra hasta 12 litros de agua por minuto evitando el desperdicio continuo.', 'Agua', 'Cierra la llave del agua durante el cepillado de dientes.'),
  ('Optimiza el uso de la energia electrica', 'Desconecta los dispositivos electronicos que no estes utilizando para evitar el consumo fantasma.', 'Energia', 'Desconecta cargadores y electrodomesticos sin uso.'),
  ('Prioriza el transporte activo o colectivo', 'Reducir el uso del vehiculo particular disminuye directamente la huella de carbono individual.', 'Transporte', 'Utiliza bicicleta, camina o usa transporte publico 2 dias a la semana.'),
  ('Separa los residuos organicos e inorganicos', 'Clasificar la basura facilita el reciclaje y disminuye la saturacion de vertederos.', 'Residuos', 'Instala contenedores diferenciados en casa para plastico, papel y organicos.');

-- Insertar Usuarios de Prueba
-- Nota: Las contrasenas en entorno real seran procesadas mediante Bcrypt.
-- Para pruebas iniciales usaremos hashes legibles temporalmente.
INSERT INTO usuarios (id, nombre, apellido, email, password_hash, rol_id, puntuacion_ambiental) VALUES
  (1, 'Administrador', 'EcoTrack', 'admin@ecotrack.org', 'aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2u', 1, 100),
  (2, 'Hansel', 'Usuario', 'hansel@ecotrack.org', 'aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2u', 2, 50)
ON CONFLICT (email) DO NOTHING;
