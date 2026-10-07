import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

type Reciclaje = 'nunca' | 'a veces' | 'casi siempre' | 'siempre';

interface DatosAhorro {
  energiaKwh: number | null;
  aguaM3: number | null;
  kmAutoSemana: number | null;
  viajesPublicoSemana: number | null;
  residuosKgSemana: number | null;
  focosLed: boolean | null;
  electrodomesticosEficientes: boolean | null;
  reciclaje: Reciclaje | null;
}

interface RecomendacionPersonalizada {
  area: string;
  icono: string;
  estado: string;
  necesitaAtencion: boolean;
  texto: string;
}

interface ResultadoAhorro {
  perfil: string;
  areasPorMejorar: number;
  recomendaciones: RecomendacionPersonalizada[];
  proximoObjetivo: string;
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  datos: DatosAhorro = {
    energiaKwh: null,
    aguaM3: null,
    kmAutoSemana: null,
    viajesPublicoSemana: null,
    residuosKgSemana: null,
    focosLed: null,
    electrodomesticosEficientes: null,
    reciclaje: null
  };

  resultado: ResultadoAhorro | null = null;

  noticiasReales = [
    {
      titulo: 'El cambio climático sigue dejando huella en la economía y la salud global',
      fuente: 'Reuters',
      url: 'https://www.reuters.com/world/',
      resumen: 'Cobertura internacional sobre clima, energía y sostenibilidad.'
    },
    {
      titulo: 'Naciones Unidas: avances climáticos y retos para 2025',
      fuente: 'UNEP',
      url: 'https://www.unep.org/news-and-stories',
      resumen: 'Actualidad climática y soluciones sostenibles a nivel mundial.'
    },
    {
      titulo: 'Cambio climático: cómo la sostenibilidad impacta cada día en la vida urbana',
      fuente: 'National Geographic',
      url: 'https://www.nationalgeographic.com/environment/article/climate-change',
      resumen: 'Reportajes sobre medio ambiente, energía y adaptación climática.'
    },
    {
      titulo: 'BBC Science & Environment',
      fuente: 'BBC',
      url: 'https://www.bbc.com/news/science_and_environment',
      resumen: 'Noticias científicas y ambientales con análisis y contexto.'
    }
  ];

  analizar(formulario: NgForm): void {
    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    const energia = this.datos.energiaKwh ?? 0;
    const agua = this.datos.aguaM3 ?? 0;
    const kmAuto = this.datos.kmAutoSemana ?? 0;
    const viajesPublico = this.datos.viajesPublicoSemana ?? 0;
    const residuos = this.datos.residuosKgSemana ?? 0;

    const recomendaciones: RecomendacionPersonalizada[] = [
      this.recomendacionEnergia(energia),
      this.recomendacionAgua(agua),
      this.recomendacionTransporte(kmAuto, viajesPublico),
      this.recomendacionResiduos(residuos, this.datos.reciclaje)
    ];
    const areasPorMejorar = recomendaciones.filter((item) => item.necesitaAtencion).length;
    const primeraPrioridad = recomendaciones.find((item) => item.necesitaAtencion);

    this.resultado = {
      perfil: areasPorMejorar <= 1 ? 'Buen camino' : areasPorMejorar <= 2 ? 'Hay oportunidades' : 'Empieza con un cambio',
      areasPorMejorar,
      recomendaciones,
      proximoObjetivo: primeraPrioridad
        ? this.objetivoPara(primeraPrioridad.area)
        : 'Mantén estos hábitos y elige un consumo mensual para comparar en tu próximo recibo.'
    };
  }

  volverAEditar(): void {
    this.resultado = null;
  }

  private recomendacionEnergia(kwh: number): RecomendacionPersonalizada {
    if (kwh > 200) {
      return {
        area: 'Energía', icono: '', estado: 'Prioridad', necesitaAtencion: true,
        texto: `Registraste ${kwh} kWh al mes. Revisa los equipos que quedan conectados sin uso y compara su consumo antes de reemplazarlos.`
      };
    }
    if (!this.datos.focosLed || !this.datos.electrodomesticosEficientes) {
      return {
        area: 'Energía', icono: '', estado: 'Una mejora posible', necesitaAtencion: true,
        texto: 'Ya que tu consumo declarado no supera la referencia interna de esta guía, el siguiente paso práctico puede ser cambiar focos usados con frecuencia a LED y revisar la eficiencia al renovar aparatos.'
      };
    }
    return {
      area: 'Energía', icono: '', estado: 'Buen hábito', necesitaAtencion: false,
      texto: `Anotaste ${kwh} kWh al mes y ya usas focos LED y aparatos eficientes. Mantén el seguimiento en tu recibo mensual.`
    };
  }

  private recomendacionAgua(m3: number): RecomendacionPersonalizada {
    if (m3 > 15) {
      return {
        area: 'Agua', icono: '', estado: 'Prioridad', necesitaAtencion: true,
        texto: `Registraste ${m3} m³ al mes. Revisa posibles fugas y prueba reducir unos minutos el tiempo de ducha; compara el siguiente recibo.`
      };
    }
    return {
      area: 'Agua', icono: '', estado: 'Buen hábito', necesitaAtencion: false,
      texto: `Anotaste ${m3} m³ al mes. Mantén la revisión de fugas y observa si el consumo cambia en tu próximo recibo.`
    };
  }

  private recomendacionTransporte(kmAuto: number, viajesPublico: number): RecomendacionPersonalizada {
    if (kmAuto > 100 && viajesPublico < 3) {
      return {
        area: 'Transporte', icono: '', estado: 'Prioridad', necesitaAtencion: true,
        texto: `Con ${kmAuto} km en automóvil y ${viajesPublico} ${viajesPublico === 1 ? 'viaje' : 'viajes'} en transporte público por semana, prueba sustituir un trayecto habitual por bus, caminata o bicicleta.`
      };
    }
    return {
      area: 'Transporte', icono: '', estado: 'Buen hábito', necesitaAtencion: false,
      texto: `Registraste ${kmAuto} km en automóvil y ${viajesPublico} viajes en transporte público por semana. Mantén las alternativas compartidas o activas cuando te resulten prácticas.`
    };
  }

  private recomendacionResiduos(kg: number, reciclaje: Reciclaje | null): RecomendacionPersonalizada {
    const reciclaPoco = reciclaje === 'nunca' || reciclaje === 'a veces';
    if (kg > 5 && reciclaPoco) {
      return {
        area: 'Residuos', icono: '', estado: 'Prioridad', necesitaAtencion: true,
        texto: `Anotaste unos ${kg} kg por semana y separas residuos ${reciclaje}. Empieza por separar papel, vidrio y envases aceptados en tu zona.`
      };
    }
    if (reciclaPoco) {
      return {
        area: 'Residuos', icono: '', estado: 'Una mejora posible', necesitaAtencion: true,
        texto: `Registraste unos ${kg} kg por semana y separas residuos ${reciclaje}. Prueba separar una categoría reciclable aceptada en tu municipio.`
      };
    }
    return {
      area: 'Residuos', icono: '', estado: 'Buen hábito', necesitaAtencion: false,
      texto: `Registraste unos ${kg} kg por semana y separas residuos ${reciclaje}. Continúa separando materiales y prioriza reutilizar cuando sea posible.`
    };
  }

  private objetivoPara(area: string): string {
    switch (area) {
      case 'Energía': return 'Revisa qué equipos permanecen conectados sin uso y compara tu próximo recibo de electricidad.';
      case 'Agua': return 'Busca una posible fuga en casa y registra el consumo de agua del próximo mes.';
      case 'Transporte': return 'Cambia un trayecto semanal en automóvil por una alternativa compartida o activa.';
      default: return 'Separa una categoría reciclable que acepte el servicio de recolección de tu municipio.';
    }
  }
}