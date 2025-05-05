import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faBullhorn,
  faNewspaper,
  faUserCircle,
  faUsers,
  faPaperPlane,
  faUserLock,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const subtitle = document.querySelector('.hero-subtitle');
    setTimeout(() => {
      subtitle?.classList.add('animate');
      const letters = document.querySelectorAll('.hero-subtitle .letter');
      letters.forEach((letter, i) => {
        letter.style.animationDelay = `${i * 0.1}s`;
      });
    }, 1000);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);

  };

  const navLinks = [
    { 
      href: '#about', 
      icon: faHome, // Icono de inicio moderno
      badge: null
    },
    { 
      href: '#experience', 
      icon: faBullhorn, // Icono para reportar
      text: 'Reportar',
      badge: null // Mejor badge
    },
    { 
      href: '#projects', 
      icon: faNewspaper, // Icono más adecuado
      text: 'Noticias',
      badge: 'NEW'
    },
    { 
      href: '#profile', 
      icon: faUserCircle, // Icono de perfil profesional
      text: 'Perfil',
      badge: null
    },
    { 
      href: '#about-us', 
      icon: faUsers, // Icono para "nosotros"
      text: 'Nosotros',
      badge: null
    },
    { 
      href: '#contact', 
      icon: faPaperPlane, // Icono moderno para contacto
      text: 'Contacto',
      badge: null
    },
  ];

  return (
    <header className="perfil-header">
      <div id="particles-js" className="particles-container"></div>
      <div className="glass-overlay"></div>

      <div className="header-container">
        <nav className="navbar" aria-label="Menú principal">
          <div className="navbar-container">
            <a href="/perfil.html" className="urbat-logo" aria-label="Inicio - UR BAT">
              <span className="urbat-logo__icon-container">
                <span className="urbat-logo__icon">
                  <img 
                    src="/images/logito.png" 
                    alt="Logo" 
                    className="urbat-logo__brain-icon" 
                  />
                </span>
                <span className="urbat-logo__icon-glow"></span>
                <span className="urbat-logo__icon-particles"></span>
              </span>
              
              <span className="urbat-logo__text-container">
                <span className="urbat-logo__text">
                  <span className="urbat-logo__highlight">UR</span>
                  <span className="urbat-logo__bat-text">BAT</span>
                </span>
              </span>
              
              <span className="urbat-logo__hover-effect"></span>
              <span className="urbat-logo__active-glow"></span>
            </a>

            <div className="nav-right">
              <ul className="urbat-nav__horizontal">
                {navLinks.slice(0,6).map(({ href, icon, text, badge }) => (
                  <li className="urbat-nav__item" key={text}>
                    <a href={href} className="urbat-nav__link">
                      <span className="urbat-nav__icon-wrapper">
                        <FontAwesomeIcon icon={icon} className="urbat-nav__icon" />
                        <span className="urbat-nav__icon-aura"></span>
                      </span>
                      <span className="urbat-nav__text-wrapper">
                        <span className="urbat-nav__text">{text}</span>
                        {badge && <span className="urbat-nav__badge">{badge}</span>}
                      </span>
                      <span className="urbat-nav__gold-bar"></span>
                      <span className="urbat-nav__diamond-effect"></span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="urbat-buttons-container">
                {/* Botón Registrarse */}
                <button
                  type="button"
                  className="urbat-btn urbat-btn--register"
                  onClick={() => window.open('/registro', '_blank')}
                  aria-label="Registrarse"
                >
                  <span className="urbat-btn__icon">
                    <FontAwesomeIcon icon={faUserPlus} />
                  </span>
                  <span className="urbat-btn__text">Registrarse</span>
                  <span className="urbat-btn__hover"></span>
                </button>

                {/* Botón Iniciar Sesión */}
                <button
                  type="button"
                  className="urbat-btn urbat-btn--login"
                  onClick={() => window.open('/login', '_blank')}
                  aria-label="Iniciar Sesión"
                >
                  <span className="urbat-btn__icon">
                    <FontAwesomeIcon icon={faUserLock} />
                  </span>
                  <span className="urbat-btn__text">Acceder</span>
                  <span className="urbat-btn__hover"></span>
                </button>
              </div>
              {/* Hamburger Menu */}
              <button 
                className={`nav-hamburger-btn ${menuOpen ? 'nav-hamburger-btn--active' : ''}`} 
                aria-label="Menú móvil"
                aria-expanded={menuOpen}
                onClick={toggleMenu}
              >
                <span className="nav-hamburger-box">
                  <span className="nav-hamburger-line nav-hamburger-line--top"></span>
                  <span className="nav-hamburger-line nav-hamburger-line--middle"></span>
                  <span className="nav-hamburger-line nav-hamburger-line--bottom"></span>
                </span>
              </button>

              {/* Mobile Menu Overlay */}
              <div className={`nav-mobile-menu ${menuOpen ? 'nav-mobile-menu--visible' : ''}`}>
                <ul className="nav-mobile-list">
                  {navLinks.map(({ href, icon, text, badge }) => (
                    <li key={text} className="nav-mobile-item" onClick={() => setMenuOpen(false)}>
                      <a href={href} className="nav-mobile-link">
                        <FontAwesomeIcon icon={icon} className="nav-mobile-icon" />
                        <span className="nav-mobile-text">{text}</span>
                        {badge && <span className="nav-mobile-badge">{badge}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="navbar-background"></div>
          <div className="navbar-highlight"></div>
        </nav>
      </div>
    </header>
  );
}
