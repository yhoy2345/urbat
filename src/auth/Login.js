import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simular autenticación
      if (email && password) {
        // Mostrar autenticación de 2 factores solo si las credenciales son correctas
        setShowTwoFactor(true);
      } else {
        setError('Por favor ingresa email y contraseña');
      }
    } catch (err) {
      setError('Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSubmit = (e) => {
    e.preventDefault();
    // Validar código de 2 factores
    // Si es correcto, redirigir al inicio
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Iniciar Sesión</h2>
        
        {!showTwoFactor ? (
          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            
            <div className="auth-input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-actions">
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
              <Link to="/forgot-password" className="auth-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleTwoFactorSubmit}>
            <p className="auth-message">
              Hemos enviado un código de verificación a tu email. Por favor ingrésalo a continuación.
            </p>
            
            <div className="auth-input-group">
              <label htmlFor="twoFactorCode">Código de Verificación</label>
              <input
                type="text"
                id="twoFactorCode"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-actions">
              <button type="submit">
                Verificar
              </button>
              <button 
                type="button" 
                className="auth-link-button"
                onClick={() => setShowTwoFactor(false)}
              >
                Volver
              </button>
            </div>
          </form>
        )}
        
        <div className="auth-footer">
          ¿No tienes una cuenta? <Link to="/register" className="auth-link">Regístrate</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;