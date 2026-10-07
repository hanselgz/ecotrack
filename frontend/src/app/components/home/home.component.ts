import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as L from 'leaflet';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">EcoTrack</span>
        <h1>Actúa por tu entorno, desde el primer reporte.</h1>
        <p>
          Denuncia residuos, contaminación y problemas ambientales en tiempo real. Todo en una misma plataforma,
          simple, clara y pensada para comunidades más sostenibles.
        </p>

        <div class="cta-row" *ngIf="!authService.isLoggedIn(); else loggedUser">
          <a class="btn btn-primary" routerLink="/login">Iniciar sesión</a>
          <a class="btn btn-secondary" routerLink="/register">Crear cuenta</a>
        </div>

        <ng-template #loggedUser>
          <div class="cta-row">
            <a class="btn btn-primary" routerLink="/reports">Ir al panel</a>
          </div>
        </ng-template>

        <ul class="feature-list">
          <li>Ubicación precisa</li>
          <li>Reportes reales</li>
          <li>Seguimiento claro</li>
        </ul>
      </div>

      <div class="hero-map-wrap">
        <div class="map-card">
          <div #mapContainer class="map"></div>
          <div class="map-tag">
            <span class="map-dot"></span>
            {{ locationLabel }}
          </div>
        </div>
      </div>
    </section>

    <section class="overview">
      <div class="card-grid">
        <article class="mini-card">
          <span class="mini-icon">01</span>
          <h3>Ubicación exacta</h3>
          <p>La plataforma usa la ubicación actual del dispositivo para situar cada reporte con precisión.</p>
        </article>

        <article class="mini-card">
          <span class="mini-icon">02</span>
          <h3>Impacto real</h3>
          <p>Monitorea la evolución de incidentes ambientales y toma decisiones con mejor contexto.</p>
        </article>

        <article class="mini-card">
          <span class="mini-icon">03</span>
          <h3>Seguimiento claro</h3>
          <p>Visualiza reportes, estados y recomendaciones para actuar con rapidez y orden.</p>
        </article>
      </div>
    </section>

    <section class="news-section">
      <div class="news-header">
        <span class="eyebrow">Actualidad</span>
        <h2>Noticias ambientales reales</h2>
      </div>

      <div class="news-grid">
        <a class="news-card" *ngFor="let item of newsItems" [href]="item.url" target="_blank" rel="noopener noreferrer">
          <span>{{ item.source }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
          <strong>Leer noticia</strong>
        </a>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .hero {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 2rem;
        align-items: center;
        padding: 3rem clamp(1rem, 3vw, 2rem) 2rem;
        min-height: calc(100vh - 120px);
        background:
          radial-gradient(circle at top left, rgba(38, 159, 122, 0.2), transparent 32%),
          linear-gradient(180deg, #0b1f1a 0%, #061510 100%);
      }

      .hero-copy {
        max-width: 620px;
        padding-left: clamp(0rem, 2vw, 1rem);
      }

      .eyebrow {
        display: inline-block;
        padding: 0.35rem 0.7rem;
        border-radius: 999px;
        background: rgba(92, 220, 176, 0.14);
        border: 1px solid rgba(92, 220, 176, 0.25);
        color: #b7f5d8;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      h1 {
        margin: 1rem 0 1rem;
        font-size: clamp(2.5rem, 5vw, 5rem);
        line-height: 1.05;
        letter-spacing: -0.06em;
      }

      p {
        margin: 0;
        color: rgba(235, 245, 240, 0.8);
        font-size: 1.05rem;
        line-height: 1.7;
      }

      .cta-row {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 2rem;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        padding: 0.8rem 1.3rem;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 700;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .btn:hover {
        transform: translateY(-1px);
      }

      .btn-primary {
        background: linear-gradient(135deg, #70e0b7 0%, #33b380 100%);
        color: #072517;
        box-shadow: 0 16px 32px rgba(51, 179, 128, 0.26);
      }

      .btn-secondary {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #edf9f2;
      }

      .feature-list {
        list-style: none;
        padding: 0;
        margin: 2rem 0 0;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        color: #dff7eb;
      }

      .feature-list li {
        padding: 0.65rem 0.9rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .hero-map-wrap {
        display: flex;
        justify-content: center;
      }

      .map-card {
        width: min(100%, 520px);
        background: rgba(8, 33, 25, 0.76);
        border: 1px solid rgba(186, 233, 212, 0.22);
        border-radius: 28px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
        overflow: hidden;
      }

      .map {
        width: 100%;
        height: 430px;
        background: #163b32;
      }

      .map-tag {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 1rem 1.1rem;
        color: #dfeee7;
        font-size: 0.9rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(7, 23, 18, 0.88);
      }

      .map-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #6fe7b0;
        box-shadow: 0 0 0 6px rgba(111, 231, 176, 0.15);
      }

      .overview {
        padding: 1rem 1.5rem 0;
        background: #f5faf7;
      }

      .card-grid {
        max-width: 1160px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.25rem;
      }

      .mini-card {
        background: white;
        border: 1px solid rgba(12, 36, 28, 0.06);
        border-radius: 24px;
        padding: 1.5rem;
        box-shadow: 0 18px 40px rgba(13, 39, 30, 0.08);
      }

      .mini-icon {
        display: inline-flex;
        width: 54px;
        height: 54px;
        border-radius: 16px;
        align-items: center;
        justify-content: center;
        background: rgba(51, 179, 128, 0.12);
        font-size: 1.4rem;
        color: #0f2a22;
      }

      h3 {
        margin: 1rem 0 0.6rem;
        color: #0d1f1a;
        font-size: 1.4rem;
      }

      .mini-card p {
        color: #3f5650;
        font-size: 0.98rem;
        line-height: 1.6;
      }

      .news-section {
        background: #f5faf7;
        padding: 2rem 1.5rem 4rem;
      }

      .news-header {
        max-width: 1160px;
        margin: 0 auto 1.2rem;
      }

      .news-header h2 {
        margin: 0.5rem 0 0;
        color: #0d1f1a;
        font-size: clamp(1.8rem, 3vw, 2.5rem);
        letter-spacing: -0.05em;
      }

      .news-grid {
        max-width: 1160px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1rem;
      }

      .news-card {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
        background: #fff;
        border: 1px solid rgba(12, 36, 28, 0.07);
        border-radius: 20px;
        padding: 1.1rem;
        text-decoration: none;
        color: inherit;
        box-shadow: 0 12px 28px rgba(13, 39, 30, 0.05);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .news-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 18px 34px rgba(13, 39, 30, 0.08);
      }

      .news-card span {
        color: #1f6b46;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .news-card h3 {
        margin: 0;
        font-size: 1.05rem;
        line-height: 1.45;
      }

      .news-card p {
        margin: 0;
        color: #526c65;
        line-height: 1.6;
      }

      .news-card strong {
        margin-top: auto;
        color: #1f5f3d;
      }

      @media (max-width: 860px) {
        .hero {
          grid-template-columns: 1fr;
          text-align: center;
          padding-top: 2rem;
        }

        .hero-copy {
          max-width: none;
          padding-left: 0;
        }

        .cta-row,
        .feature-list {
          justify-content: center;
        }

        .card-grid,
        .news-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class HomeComponent implements AfterViewInit {

  private readonly authService = inject(AuthService);
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  locationLabel = 'Detectando ubicación...';
  newsItems = [
    {
      source: 'Reuters',
      title: 'El clima sigue marcando la agenda económica y social global',
      summary: 'Nuevas alertas ambientales y desafios de sostenibilidad marcan el pulso internacional.',
      url: 'https://www.reuters.com/world/'
    },
    {
      source: 'UNEP',
      title: 'Avances climáticos y metas para una transición más sostenible',
      summary: 'Informe global sobre energía, adaptación y respuesta ambiental en 2025.',
      url: 'https://www.unep.org/news-and-stories'
    },
    {
      source: 'BBC',
      title: 'Ciencia y medio ambiente: lo más relevante del momento',
      summary: 'Cobertura de cambio climático, biodiversidad y soluciones sostenibles.',
      url: 'https://www.bbc.com/news/science_and_environment'
    },
    {
      source: 'National Geographic',
      title: 'Cómo la sostenibilidad impacta la vida urbana y el planeta',
      summary: 'Reportajes sobre ciudades, energía y la acción colectiva frente al clima.',
      url: 'https://www.nationalgeographic.com/environment/article/climate-change'
    }
  ];

  private map?: L.Map;
  private marker?: L.Marker;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const fallbackLocation: L.LatLngExpression = [14.6281, -90.5154];
    const latLng = fallbackLocation;

    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true
    }).setView(latLng, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker(latLng).addTo(this.map);
    this.marker.bindPopup('Ubicación aproximada');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const current: L.LatLngExpression = [position.coords.latitude, position.coords.longitude];
          this.locationLabel = 'Tu ubicación actual';
          this.map?.setView(current, 15);
          this.marker?.setLatLng(current);
          this.marker?.bindPopup('Tu ubicación actual');
        },
        () => {
          this.locationLabel = 'Ubicación estimada';
          this.marker?.bindPopup('Ubicación estimada');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      this.locationLabel = 'Ubicación estimada';
    }

    setTimeout(() => this.map?.invalidateSize(), 200);
  }
}
