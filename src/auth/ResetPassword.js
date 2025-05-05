import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simular llamada al backend para cambiar contraseña
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Limpiar datos temporales
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('resetCode');
      
      setSuccess('¡Contraseña actualizada correctamente!');
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Error al actualizar la contraseña. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Crear Nueva Contraseña</h2>
        <p className="auth-subtitle">Ingresa y confirma tu nueva contraseña</p>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          
          <div className="auth-input-group">
            <label htmlFor="newPassword">Nueva Contraseña</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          
          <div className="auth-input-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu nueva contraseña"
              required
            />
          </div>
          
          <div className="auth-actions">
            <button 
              type="submit" 
              disabled={isLoading}
              className="auth-submit-button"
            >
              {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;