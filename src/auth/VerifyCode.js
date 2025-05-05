import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Obtener el código y email guardados
      const savedCode = sessionStorage.getItem('resetCode');
      const email = sessionStorage.getItem('resetEmail');
      
      if (!email || !savedCode) {
        setError('Solicitud expirada. Por favor intenta nuevamente.');
        return;
      }
      
      if (code !== savedCode) {
        setError('Código incorrecto. Intenta nuevamente.');
        return;
      }
      
      // Código correcto, redirigir a cambiar contraseña
      navigate('/reset-password');
    } catch (err) {
      setError('Error al verificar el código. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Verificar Código</h2>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          
          <div className="auth-input-group">
            <label htmlFor="code">Código de verificación</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingresa el código de 6 dígitos"
              required
            />
          </div>
          
          <div className="auth-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Verificar Código'}
            </button>
            <button 
              type="button" 
              className="auth-link-button"
              onClick={() => navigate('/forgot-password')}
            >
              Reenviar código
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;