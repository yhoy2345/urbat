import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simular envío de código al email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una implementación real, aquí enviarías el código al backend
      // y el backend lo mandaría por email al usuario
      const verificationCode = Math.floor(100000 + Math.random() * 900000); // Genera código de 6 dígitos
      
      // Simulamos que guardamos el código y email temporalmente
      sessionStorage.setItem('resetEmail', email);
      sessionStorage.setItem('resetCode', verificationCode.toString());
      
      setSuccess(`Hemos enviado un código de verificación a ${email}. Por favor ingrésalo a continuación.`);
      
      // Redirigir a la página de verificación de código
      setTimeout(() => navigate('/verify-code'), 1500);
    } catch (err) {
      setError('Error al enviar el código. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Recuperar Contraseña</h2>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          
          <div className="auth-input-group">
            <label htmlFor="email">Email registrado</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="auth-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Código'}
            </button>
            <Link to="/login" className="auth-link">
              Volver al Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;