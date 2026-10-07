USE ecotrack_db_in5bm;

INSERT INTO roles (nombre)
VALUES ('ADMIN'), ('USER');

INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id)
VALUES
    ('Admin', 'EcoTrack', 'admin@ecotrack.com', '$2a$10$demoHashPlaceholderAdminOnly', 1),
    ('María', 'García', 'usuario@ecotrack.com', '$2a$10$demoHashPlaceholderUserOnly', 2);

INSERT INTO categorias_reporte (nombre, descripcion, icono)
VALUES
    ('Agua', 'Problemas relacionados con consumo, contaminación o desperdicio de agua.', 'droplet'),
    ('Deforestación', 'Tala, degradación o pérdida de áreas verdes y bosques.', 'tree'),
    ('Basura', 'Acumulación de residuos sólidos en espacios públicos o naturales.', 'trash'),
    ('Aire', 'Emisiones, humo, polvo o contaminación atmosférica.', 'wind'),
    ('Suelo', 'Contaminación o degradación del suelo y terrenos.', 'mountain'),
    ('Ruido', 'Perturbación sonora por tráfico, industria o actividades humanas.', 'volume'),
    ('Fauna y flora', 'Afectación a especies animales o vegetales en el entorno.', 'leaf'),
    ('Otro', 'Reportes ambientales que no encajan en categorías específicas.', 'info');

INSERT INTO ubicaciones (departamento, municipio, direccion, referencia, latitud, longitud)
VALUES
    ('San Salvador', 'San Salvador', 'Avenida Las Magnolias 123', 'Cerca del parque central', 13.6989, -89.1914),
    ('La Libertad', 'Santa Tecla', 'Colonia Los Almendros', 'Frente a la iglesia', 13.6732, -89.2798);

INSERT INTO recomendaciones (titulo, descripcion, categoria_impacto, accion_sugerida)
VALUES
    ('Ahorrar agua', 'Reduce el consumo de agua al ducharte y cerrar la llave mientras te cepillas los dientes.', 'Agua', 'Toma duchas cortas y repara fugas a tiempo.'),
    ('Reducir consumo energético', 'Usa luces LED y desconecta dispositivos que no utilices.', 'Energía', 'Apaga equipos y prioriza electrodomésticos eficientes.'),
    ('Usar menos vehículo', 'Disminuye la emisión de gases al compartir transporte o caminar rutas cortas.', 'Transporte', 'Usa transporte público o bicicleta cuando sea posible.'),
    ('Reciclar correctamente', 'Separa residuos para facilitar su reutilización y reciclaje.', 'Residuos', 'Separa papel, vidrio, plástico y orgánicos por tipo.'),
    ('Reducir residuos', 'Minimiza el uso de materiales de un solo uso.', 'General', 'Usa recipientes reutilizables y compra productos duraderos.');

INSERT INTO reportes_ambientales (
    titulo,
    descripcion,
    fotografia,
    estado,
    nivel_impacto,
    observaciones_evaluacion,
    usuario_id,
    categoria_id,
    ubicacion_id
)
VALUES (
    'Acumulación de basura en parque',
    'Se observan residuos sólidos en el área de recreación del parque central y se necesita limpieza urgente.',
    'https://example.com/images/reporte-basura.jpg',
    'Pendiente',
    'Medio',
    'El reporte está pendiente de revisión por parte del área administrativa.',
    2,
    3,
    1
);

INSERT INTO evaluaciones_impacto (
    usuario_id,
    transporte_tipo,
    transporte_distancia,
    energia_kwh,
    agua_litros,
    residuos_kg,
    huella_carbono_kg,
    puntuacion_ambiental
)
VALUES (
    2,
    'Automóvil',
    18.50,
    42.00,
    180.00,
    8.70,
    21.40,
    72
);

INSERT INTO notificaciones (usuario_id, titulo, mensaje)
VALUES
    (2, 'Reporte recibido', 'Tu reporte ambiental fue recibido y está pendiente de revisión.'),
    (2, 'Evaluación completada', 'La evaluación de impacto ha sido procesada y ya está disponible en tu dashboard.');