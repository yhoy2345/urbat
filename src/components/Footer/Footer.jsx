import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="urbat-footer">
      <div className="footer-highlight-bar"></div>
      
      <div className="footer-content">
        <div className="footer-section logo-section">
          <div className="footer-logo">
            <span className="logo-highlight">UR</span>BAT
          </div>
          <p className="footer-tagline">
            Plataforma de seguridad comunitaria 
          </p>
          <div className="footer-social">
            <button className="social-icon" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </button>
            <button className="social-icon" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </button>
            <button className="social-icon" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </button>
          </div>
        </div>

        <div className="footer-section links-section">
          <h3 className="footer-title">Enlaces Rápidos</h3>
          <ul className="footer-links">
            <li><Link to="/mapa" className="footer-link">Mapa de Alertas</Link></li>
            <li><Link to="/reportar" className="footer-link">Reportar Incidente</Link></li>
            <li><Link to="/estadisticas" className="footer-link">Estadísticas</Link></li>
            <li><Link to="/blog" className="footer-link">Blog de Seguridad</Link></li>
          </ul>
        </div>

        <div className="footer-section contact-section">
          <h3 className="footer-title">Contacto</h3>
          <ul className="footer-contact">
            <li><i className="fas fa-map-marker-alt"></i> Huánuco, Perú</li>
            <li><i className="fas fa-phone"></i> +51 123 456 789</li>
            <li><i className="fas fa-envelope"></i> contacto@urbat.com</li>
          </ul>
        </div>

        <div className="footer-section newsletter-section">
          <h3 className="footer-title">Boletín de Seguridad</h3>
          <p className="newsletter-text">
            Recibe alertas y consejos de seguridad en tu correo
          </p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="newsletter-input"
            />
            <button className="newsletter-btn">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">
          © {new Date().getFullYear()} URBAT. Todos los derechos reservados. Leo kbro
        </div>
        <div className="footer-legal">
          <Link to="/privacidad" className="legal-link">Política de Privacidad</Link>
          <Link to="/terminos" className="legal-link">Términos de Servicio</Link>
        </div>
      </div>

      <div className="footer-particles"></div>
    </footer>
  );
};

export default Footer;