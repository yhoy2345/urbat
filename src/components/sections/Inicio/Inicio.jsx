import React from 'react';
import './Inicio.css';

export default function Inicio() {
  return (
    <div className="inicio-container">
      <h1>¡Bienvenido a URBAT!</h1>
      <p>Contenido de la página de inicio</p>
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <p>Este es un contenido adicional para verificar que el layout funciona.</p>
      </div>
    </div>
  );
}