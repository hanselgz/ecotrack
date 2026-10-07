import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Reporte, ReporteService } from './reporte.service';

describe('ReporteService', () => {
  let service: ReporteService;
  let httpTesting: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/reportes-ambientales';
  const reporte: Reporte = {
    id: 12,
    usuario_id: 4,
    titulo: 'Reporte de prueba',
    descripcion: 'Descripción de prueba',
    estado: 'pendiente'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ReporteService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('comparte y conserva en memoria la carga inicial de reportes', () => {
    let snapshot: Reporte[] | null = null;
    service.reportes$.subscribe((reportes) => snapshot = reportes);

    service.obtenerReportes().subscribe();
    httpTesting.expectOne(apiUrl).flush({ data: [reporte] });

    expect(snapshot).toEqual([reporte]);
    service.obtenerReportes().subscribe((respuesta) => expect(respuesta.data).toEqual([reporte]));
    httpTesting.expectNone(apiUrl);
  });

  it('actualiza el estado de inmediato y confirma el valor del backend', () => {
    let estadoActual = '';
    service.reportes$.subscribe((reportes) => estadoActual = reportes?.[0]?.estado ?? '');
    service.obtenerReportes().subscribe();
    httpTesting.expectOne(apiUrl).flush({ data: [reporte] });

    let confirmado = false;
    const solicitud = service.actualizarEstado(reporte.id!, 'resuelto').subscribe(() => confirmado = true);
    expect(estadoActual).toBe('resuelto');

    httpTesting.expectOne({ method: 'PATCH', url: `${apiUrl}/${reporte.id}/estado` })
      .flush({ data: { ...reporte, estado: 'resuelto' } });

    expect(confirmado).toBe(true);
    expect(estadoActual).toBe('resuelto');
    solicitud.unsubscribe();
  });

  it('revierte el estado optimista si el backend responde con error', () => {
    let estadoActual = '';
    service.reportes$.subscribe((reportes) => estadoActual = reportes?.[0]?.estado ?? '');
    service.obtenerReportes().subscribe();
    httpTesting.expectOne(apiUrl).flush({ data: [reporte] });

    let recibioError = false;
    service.actualizarEstado(reporte.id!, 'verificado').subscribe({
      error: () => recibioError = true
    });
    expect(estadoActual).toBe('verificado');

    httpTesting.expectOne({ method: 'PATCH', url: `${apiUrl}/${reporte.id}/estado` })
      .flush({ message: 'Fallo simulado' }, { status: 500, statusText: 'Server Error' });

    expect(recibioError).toBe(true);
    expect(estadoActual).toBe('pendiente');
  });

  it('incorpora un reporte confirmado al snapshot sin volver a cargar la lista', () => {
    const snapshots: Reporte[][] = [];
    service.reportes$.subscribe((reportes) => {
      if (reportes) snapshots.push(reportes);
    });
    service.obtenerReportes().subscribe();
    httpTesting.expectOne(apiUrl).flush({ data: [reporte] });

    const nuevoReporte = { ...reporte, id: 13, titulo: 'Nuevo reporte' };
    service.crearReporte(nuevoReporte).subscribe();
    httpTesting.expectOne({ method: 'POST', url: apiUrl }).flush({ data: nuevoReporte });

    expect(snapshots.at(-1)?.map((item) => item.id)).toEqual([13, 12]);
    httpTesting.expectNone({ method: 'GET', url: apiUrl });
  });
});