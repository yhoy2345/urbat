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
      <div className="map-section" style={{ marginTop: '2rem' }}>
        <MapComponent />
      </div>
      
      
      
      

    </div>
  );
};

export default Inicio;