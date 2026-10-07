import { Router } from 'express';

const router = Router();

// Lógica de cálculo de huella de carbono (Factores de emisión estándar)
router.post('/impacto', (req, res) => {
  try {
    const { 
      usuario_id = 1,
      transporte_km_semana = 0, 
      tipo_transporte = 'gasolina',
      energia_kwh_mes = 0,
      agua_m3_mes = 0,
      residuos_kg_semana = 0,
      recicla = false
    } = req.body;

    let factorTransporte = 0.21; // promedio auto gasolina
    if (tipo_transporte === 'diesel') factorTransporte = 0.25;
    if (tipo_transporte === 'publico') factorTransporte = 0.08;
    if (tipo_transporte === 'electrico') factorTransporte = 0.05;
    if (tipo_transporte === 'bicicleta') factorTransporte = 0.0;

    const huellaTransporteMes = (transporte_km_semana * 4) * factorTransporte;
    const huellaEnergiaMes = energia_kwh_mes * 0.45;
    const huellaAguaMes = agua_m3_mes * 0.35;
    const huellaResiduosMes = (residuos_kg_semana * 4) * (recicla ? 0.8 : 1.5);

    const huellaCarbonoTotal = Number((huellaTransporteMes + huellaEnergiaMes + huellaAguaMes + huellaResiduosMes).toFixed(2));

    // Puntuación ambiental (1 a 100, donde 100 es lo más ecológico)
    let puntuacion = 100 - Math.min(Math.floor(huellaCarbonoTotal / 10), 90);

    const evaluacion = {
      usuario_id,
      huella_carbono_total: huellaCarbonoTotal,
      puntuacion_ambiental: puntuacion,
      detalles: {
        transporte_co2: Number(huellaTransporteMes.toFixed(2)),
        energia_co2: Number(huellaEnergiaMes.toFixed(2)),
        agua_co2: Number(huellaAguaMes.toFixed(2)),
        residuos_co2: Number(huellaResiduosMes.toFixed(2))
      },
      fecha_creacion: new Date()
    };

    return res.status(201).json({
      success: true,
      message: 'Evaluación de impacto ambiental realizada con éxito',
      data: evaluacion
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al calcular el impacto ambiental',
      data: null
    });
  }
});

export default router;