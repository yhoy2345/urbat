import React, { useEffect } from 'react';
import './Header.css';

export default function Header() {
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

  return (
    <header className="perfil-header">
      <div id="particles-js" className="particles-container"></div>
      <div className="glass-overlay"></div>
      <div className="header-container">
        <nav className="navbar">
          <div className="navbar-container">
            <a href="/perfil.html" className="logo" aria-label="IA Developer Logo">
              <span className="logo-icon-wrapper">
                <span className="logo-icon"><i className="fas fa-brain"></i></span>
                <span className="logo-icon-glow"></span>
              </span>
              <span className="logo-text-wrapper">
                <span className="logo-text">
                  <span className="logo-highlight">IA</span>DEVELOPER
                </span>
                <span className="logo-pulse" aria-hidden="true"></span>
              </span>
              <span className="logo-hover-effect"></span>
            </a>

            <div className="nav-right">
              <ul className="nav-links">
                {[
                  { href: '#about', icon: 'fa-user', text: 'Yo' },
                  { href: '#experience', icon: 'fa-briefcase', text: 'Experiencia' },
                  { href: '#projects', icon: 'fa-code-branch', text: 'Proyectos' },
                  { href: '#contact', icon: 'fa-envelope', text: 'Contacto' }
                ].map(({ href, icon, text }) => (
                  <li className="nav-item" key={text}>
                    <a href={href} className="nav-link">
                      <span className="nav-icon"><i className={`fas ${icon}`}></i></span>
                      <span className="link-text-wrapper">
                        <span className="link-text">{text}</span>
                        <span className="link-underline"></span>
                      </span>
                      <span className="link-hover-effect"></span>
                    </a>
                  </li>
                ))}
              </ul>

              <a href="#" className="btn-resume">
                <span className="nav-icon"><i className="fas fa-file-alt"></i></span>
                <span className="btn-text">Currículum</span>
                <div className="btn-arrow">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M5 1l6 7-6 7" />
                  </svg>
                </div>
                <div className="btn-hover-effect"></div>
              </a>

              <div className="hamburger" aria-label="Menú">
                <div className="hamburger-line line-1"></div>
                <div className="hamburger-line line-2"></div>
                <div className="hamburger-line line-3"></div>
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
