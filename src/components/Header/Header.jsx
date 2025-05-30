import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { 
  faHome,
  faBullhorn,
  faNewspaper,
  faUserCircle,
  faUsers,
  faPaperPlane,
  faUserLock,
  faUserPlus,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Verificación completa
        if (parsedUser && typeof parsedUser.nombre === 'string') {
          setUser(parsedUser);
        } else {
          console.error('Datos de usuario inválidos:', parsedUser);
          localStorage.removeItem('user'); // Limpia datos corruptos
        }
      } catch (error) {
        console.error('Error al parsear usuario:', error);
      }
    } 
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const navLinks = [
    { 
      href: '/', 
      icon: faHome,
      text: 'Inicio',
      badge: null
    },
    { 
      href: '/Reportar', 
      icon: faBullhorn,
      text: 'Reportar',
      badge: null
    },
    { 
      href: '/posts', 
      icon: faNewspaper,
      text: 'Posts',
      badge: 'NEW'
    },
    { 
      href: '/perfil', 
      icon: faUserCircle,
      text: 'Perfil',
      badge: null
    },
    { 
      href: '/nosotros', 
      icon: faUsers,
      text: 'Nosotros',
      badge: null
    },
    { 
      href: '/contacto', 
      icon: faPaperPlane,
      text: 'Contacto',
      badge: null
    },
  ];

  return (
    <header className="perfil-header">
      <div id="particles-js" className="particles-container"></div>
      <div className="header-container">
        <nav className="navbar" aria-label="Menú principal">
          <div className="navbar-container">
            <Link to="/" className="urbat-logo" aria-label="Inicio - UR BAT">
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
            </Link>

            <div className="nav-right">
              <ul className="urbat-nav__horizontal">
                {navLinks.map(({ href, icon, text, badge }) => (
                  <li className="urbat-nav__item" key={text}>
                    <Link 
                      to={href.replace('#', '')}
                      className="urbat-nav__link"
                    >
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
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="urbat-buttons-container">
                {user ? (
                  <div className="user-logged-container">
                    <div className="user-greeting">
                      <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
                      <span className="welcome-message">
                      Hola, <span className="user-name">{user.nombre}</span>
                    </span>
                    </div>
                    <button
                      type="button"
                      className="urbat-btn urbat-btn--logout"
                      onClick={handleLogout}
                      aria-label="Cerrar sesión"
                    >
                      <span className="urbat-btn__icon">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                      </span>
                      <span className="urbat-btn__text">Salir</span>
                      <span className="urbat-btn__hover"></span>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className="urbat-btn urbat-btn--register"
                      onClick={() => navigate('/register')}
                      aria-label="Registrarse"
                    >
                      <span className="urbat-btn__icon">
                        <FontAwesomeIcon icon={faUserPlus} />
                      </span>
                      <span className="urbat-btn__text">Registrarse</span>
                      <span className="urbat-btn__hover"></span>
                    </button>

                    <button
                      type="button"
                      className="urbat-btn urbat-btn--login"
                      onClick={() => navigate('/login')}
                      aria-label="Iniciar Sesión"
                    >
                      <span className="urbat-btn__icon">
                        <FontAwesomeIcon icon={faUserLock} />
                      </span>
                      <span className="urbat-btn__text">Acceder</span>
                      <span className="urbat-btn__hover"></span>
                    </button>
                  </>
                )}
              </div>

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

              <div className={`nav-mobile-menu ${menuOpen ? 'nav-mobile-menu--visible' : ''}`}>
                <ul className="nav-mobile-list">
                  {navLinks.map(({ href, icon, text, badge }) => (
                    <li key={text} className="nav-mobile-item" onClick={() => setMenuOpen(false)}>
                      <Link to={href.toLowerCase()} className="nav-mobile-link">
                        <FontAwesomeIcon icon={icon} className="nav-mobile-icon" />
                        <span className="nav-mobile-text">{text}</span>
                        {badge && <span className="nav-mobile-badge">{badge}</span>}
                      </Link>
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