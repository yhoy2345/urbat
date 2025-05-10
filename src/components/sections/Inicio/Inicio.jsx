import React, { useEffect } from 'react';
import './Inicio.css';
import MapComponent from '../../Map/MapComponent';

const Inicio = () => {
  useEffect(() => {
    // Animación de entrada para los elementos
    const elements = document.querySelectorAll('.feature-card, .action-buttons, h1, p');
    elements.forEach((el, index) => {
      el.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1 + 0.3}s forwards`;
      el.style.opacity = '0';
    });
  }, []);

  return (
    <div className="inicio-container">
      {/* Contenedor  para la descripción */}
      <div className="description-container animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
        <p className="premium-description">          
          <span className="description-text">
            Plataforma inteligente de alertas comunitarias para{" "}
            
            <span className="city-highlight animate-glow-in" style={{ 
              '--glow-intensity': 0.8, 
              '--gradient-start': 'var(--urbat-sky)',
              '--gradient-end': 'var(--urbat-gold)',
              animationDelay: "0.9s"
            }}>
              Huánuco
              <span className="highlight-ornament"></span> {/* Elemento decorativo añadido */}
            </span>
          </span>
        </p>
      </div>
      <div className="map-section" style={{ marginTop: '3rem' }}>
        <MapComponent />
      </div>
      {/* === Sección de Alertas en Tiem Real === */}
      <section className="live-alerts-section" style={{ marginTop: '2rem', padding: '1.5rem', background: '#1a1a2e', borderRadius: '12px' }}>
        <div className="alert-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#f8f8f8', margin: 0 }}>
            🔥 Alertas Activas <span className="badge" style={{ background: '#e94560', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem' }}>5</span>
          </h2>
          <button 
            className="report-button" 
            style={{
              background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
              border: 'none',
              padding: '0.5rem 1.2rem',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Reportar Incidente
          </button>
        </div>

        {/* Lista de Alertas */}
        <div className="alerts-list" style={{ marginTop: '1.5rem' }}>
          {[1, 2, 3, 4, 5].map((alert) => (
            <div 
              key={alert} 
              className="alert-card" 
              style={{
                background: '#16213e',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                borderLeft: '4px solid #e94560',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              <div className="alert-icon" style={{ flexShrink: 0 }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: 'rgba(233, 69, 96, 0.2)', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9V11M12 15H12.01M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V16.2C19 17.8802 19 18.7202 18.673 19.362C18.3854 19.9265 17.9265 20.3854 17.362 20.673C16.7202 21 15.8802 21 14.2 21H9.8C8.11984 21 7.27976 21 6.63803 20.673C6.07354 20.3854 5.6146 19.9265 5.32698 19.362C5 18.7202 5 17.8802 5 16.2V7.8Z" stroke="#e94560" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="alert-content" style={{ flexGrow: 1 }}>
                <h3 style={{ color: '#f8f8f8', margin: '0 0 0.3rem 0' }}>Asalto a mano armada</h3>
                <p style={{ color: '#a8a8a8', margin: 0, fontSize: '0.9rem' }}>Av. Principal #123 - Hace 15 min</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <span style={{ color: '#e94560', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="#e94560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#e94560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    1.2 km de ti
                  </span>
                  <span style={{ color: '#0f969c', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#0f969c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    5 confirmaciones
                  </span>
                </div>
              </div>
              <button 
                className="alert-action" 
                style={{
                  background: 'transparent',
                  border: '1px solid #e94560',
                  color: '#e94560',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>

        {/* Stats en Tiempo Real */}
        <div className="real-time-stats" style={{ 
          marginTop: '2rem',
          padding: '1rem',
          background: '#0f3460',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <div className="stat-item" style={{ textAlign: 'center' }}>
            <p style={{ color: '#a8a8a8', margin: '0 0 0.3rem 0', fontSize: '0.8rem' }}>Reportes hoy</p>
            <p style={{ color: '#f8f8f8', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>24</p>
          </div>
          <div className="stat-item" style={{ textAlign: 'center' }}>
            <p style={{ color: '#a8a8a8', margin: '0 0 0.3rem 0', fontSize: '0.8rem' }}>Vecinos activos</p>
            <p style={{ color: '#f8f8f8', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>142</p>
          </div>
          <div className="stat-item" style={{ textAlign: 'center' }}>
            <p style={{ color: '#a8a8a8', margin: '0 0 0.3rem 0', fontSize: '0.8rem' }}>Zona más caliente</p>
            <p style={{ color: '#f8f8f8', margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Centro</p>
          </div>
        </div>
      </section>

      {/* === Sección de Tips de Seguridad === */}
      <section className="safety-tips" style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <h2 style={{ marginTop: 0 }}>💡 Tips de Seguridad Premium</h2>
        <div className="tips-grid" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div className="tip-card" style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ color: '#0f969c', margin: '0 0 0.5rem 0' }}>Modo Sigiloso</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Activa el "Modo Sicario" en ajustes para navegar de forma anónima cuando estés en zonas peligrosas.</p>
          </div>
          <div className="tip-card" style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ color: '#e94560', margin: '0 0 0.5rem 0' }}>Botón del Pánico</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Mantén presionado el botón de volumen 3 segundos para enviar alerta silenciosa con tu ubicación.</p>
          </div>
          <div className="tip-card" style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ color: '#ffc107', margin: '0 0 0.5rem 0' }}>Código Vecinal</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Usa el hashtag #LeolaLactaAlCrimen en redes para reportes verificados con prioridad.</p>
          </div>
        </div>
      </section>

      
      
      
      

    </div>
  );
};

export default Inicio;