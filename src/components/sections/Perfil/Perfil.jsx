import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faSignOutAlt, faDatabase } from '@fortawesome/free-solid-svg-icons';
import './Perfil.css';

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      try {
        setLoading(true);
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        
        // Validación de datos básica
        if (!parsedUser?.id || !parsedUser?.nombre || !parsedUser?.email) {
          throw new Error('Datos de usuario incompletos');
        }

        setUserData({
          ...parsedUser,
          fechaRegistro: parsedUser.created_at 
            ? new Date(parsedUser.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : 'Fecha no disponible',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedUser.nombre)}&background=2f99eb&color=fff`
        });
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err);
        setError(err.message);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <p>Error al cargar el perfil: {error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  if (!userData) {
    return null; // O mostrar un mensaje de redirección
  }

  return (
    <div className="profile-container">
      <div className="profile-background">
        <div className="particles">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                '--random-x': Math.random() * 2 - 1,
                '--random-y': Math.random() * 2 - 1,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="profile-card animate-fade-in-up">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img 
              src={userData.avatar} 
              alt={`Avatar de ${userData.nombre}`} 
              className="profile-avatar"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.nombre)}&background=2f99eb&color=fff`;
              }}
            />
            <div className="avatar-border"></div>
          </div>
          <h1 className="profile-name">
            <span className="city-highlight animate-glow-in">{userData.nombre}</span>
          </h1>
          <p className="profile-email">{userData.email}</p>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">
              <FontAwesomeIcon icon={faDatabase} className="detail-icon" />
              ID de usuario
            </span>
            <span className="detail-value">{userData.id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">
              <FontAwesomeIcon icon={faDatabase} className="detail-icon" />
              Miembro desde
            </span>
            <span className="detail-value">{userData.fechaRegistro}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">
              <FontAwesomeIcon icon={faDatabase} className="detail-icon" />
              Base de datos
            </span>
            <span className="detail-value">prueba_react</span>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/editar-perfil')}
          >
            <span className="btn-icon">
              <FontAwesomeIcon icon={faUserEdit} />
            </span>
            <span className="btn-text">Editar perfil</span>
            <span className="btn-hover-effect"></span>
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleLogout}
          >
            <span className="btn-icon">
              <FontAwesomeIcon icon={faSignOutAlt} />
            </span>
            <span className="btn-text">Cerrar sesión</span>
            <span className="btn-hover-effect"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;