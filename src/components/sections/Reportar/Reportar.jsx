import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Reportar.css';

const Reportar = () => {
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setMedia(URL.createObjectURL(file));
        setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
      } else {
        setError('Por favor, sube solo imágenes o videos');
      }
    }
  };

  const openCamera = () => {
    // Aquí iría la lógica para abrir la cámara
    alert('Funcionalidad de cámara se implementará aquí');
  };

  const handleElegirUbicacion = () => {
    navigate('/seleccionar-ubicacion', {
      state: {
        fromReport: true,
        ubicacionActual: ubicacion // Envía la ubicación actual si existe
      }
    });
  };

  useEffect(() => {
    if (location.state?.fromMap && location.state?.ubicacion) {
      setUbicacion(location.state.ubicacion);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!media || !tipoAlerta || !descripcion || !ubicacion) {
      setError('Por favor, completa todos los campos obligatorios');
      return;
    }
    // Aquí iría la lógica para enviar el reporte
    alert('Reporte enviado correctamente');
    // Resetear formulario
    setMedia(null);
    setTipoAlerta('');
    setDescripcion('');
    setUbicacion(null);
  };

  return (
    <div className="reportar-container">
      <h2>Reportar Incidente</h2>
      <form onSubmit={handleSubmit}>
        {/* Sección de multimedia */}
        <div className="form-section">
          <h3>Subir evidencia</h3>
          <div className="media-options">
            <button type="button" onClick={openCamera} className="media-button">
              Abrir Cámara
            </button>
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()} 
              className="media-button"
            >
              Elegir de Galería
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaChange}
              accept="image/*, video/*"
              style={{ display: 'none' }}
            />
          </div>
          {media && (
            <div className="media-preview">
              {mediaType === 'image' ? (
                <img src={media} alt="Previsualización" />
              ) : (
                <video controls>
                  <source src={media} type="video/mp4" />
                </video>
              )}
            </div>
          )}
        </div>

        {/* Selección de tipo de alerta */}
        <div className="form-section">
          <h3>Tipo de Alerta</h3>
          <div className="alert-options">
            <button
              type="button"
              className={`alert-button ${tipoAlerta === 'peligroso' ? 'danger' : ''}`}
              onClick={() => setTipoAlerta('peligroso')}
            >
              Peligroso
            </button>
            <button
              type="button"
              className={`alert-button ${tipoAlerta === 'advertencia' ? 'warning' : ''}`}
              onClick={() => setTipoAlerta('advertencia')}
            >
              Advertencia
            </button>
            <button
              type="button"
              className={`alert-button ${tipoAlerta === 'informativo' ? 'info' : ''}`}
              onClick={() => setTipoAlerta('informativo')}
            >
              Informativo
            </button>
          </div>
        </div>

        {/* Descripción */}
        <div className="form-section">
          <h3>Descripción de lo sucedido</h3>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe con detalle lo ocurrido..."
            rows={5}
          />
        </div>

        {/* Ubicación */}
        <div className="form-section">
          <h3>Ubicación</h3>
          <button
            type="button"
            className="location-button"
            onClick={handleElegirUbicacion}
          >
            Elegir Ubicación
          </button>
          {ubicacion && (
            <div className="location-preview">
              <p>Ubicación seleccionada: {ubicacion.lat}, {ubicacion.lng}</p>
              {ubicacion.referencia && <p>Referencia: {ubicacion.referencia}</p>}
            </div>
          )}
        </div>

        {/* Botón de enviar */}
        <button
          type="submit"
          className="submit-button"
          disabled={!media || !tipoAlerta || !descripcion || !ubicacion}
        >
          Enviar Reporte
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Reportar;