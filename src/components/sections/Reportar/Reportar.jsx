import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Reportar.css';

import CameraComponent from './CamaraComponent';

const Reportar = () => {
  // Estados existentes
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState(null);
  const [error, setError] = useState('');
  
  // Nuevos estados para manejar las nuevas funcionalidades
  const [reporteExitoso, setReporteExitoso] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportesRecientes, setReportesRecientes] = useState([]);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showCamera, setShowCamera] = useState(false);
  

  // Efecto para ocultar el mensaje de éxito después de 3 segundos
  useEffect(() => {
    if (reporteExitoso) {
      const timer = setTimeout(() => {
        setReporteExitoso(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [reporteExitoso]);

  // Actualizar ubicación si viene de ReportarForm
  useEffect(() => {
    if (location.state?.fromReportForm && location.state?.nuevaUbicacion) {
      setUbicacion(location.state.nuevaUbicacion);
    }
  }, [location.state]);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setMedia(URL.createObjectURL(file));
        setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
        setError('');
      } else {
        setError('Por favor, sube solo imágenes o videos');
      }
    }
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
  };  


  const handleCapture = (dataUrl) => {
    setMedia(dataUrl);
    setMediaType('image');
    setShowCamera(false);
  };

  const handleElegirUbicacion = () => {
    navigate('/Reportar-form', {
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
    
    // Simular carga de reportes recientes (en una app real esto vendría de una API)
    const mockReportes = [
      {
        id: 1,
        tipo: 'peligroso',
        descripcion: 'Accidente automovilístico en la avenida principal',
        tiempo: 'Hace 15 min',
        distancia: '0.5',
        confirmaciones: 3
      },
      {
        id: 2,
        tipo: 'advertencia',
        descripcion: 'Bache grande en calle secundaria',
        tiempo: 'Hace 30 min',
        distancia: '1.2',
        confirmaciones: 5
      }
    ];
    setReportesRecientes(mockReportes);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!media || !tipoAlerta || !descripcion || !ubicacion) {
      setError('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Simular envío a API (en una app real aquí iría la llamada real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostrar mensaje de éxito
      setReporteExitoso(true);
      
      // Resetear formulario
      setMedia(null);
      setMediaType('');
      setTipoAlerta('');
      setDescripcion('');
      setUbicacion(null);
      
      // Aquí podrías actualizar la lista de reportes recientes
      // con el nuevo reporte enviado
      
    } catch (err) {
      setError('Error al enviar el reporte. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reportar-container">
      {/* Encabezado claro y descriptivo */}
      <div className="header-section">
        <h2>¿Ocurrió algo en tu zona?</h2>
        <p className="subheader">Reporta un incidente para alertar a la comunidad</p>
      </div>

      {/* Mensaje de éxito (oculto por defecto) */}
      {reporteExitoso && (
        <div className="success-message">
          <p>¡Reporte enviado con éxito!</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Ubicación - con mapa de previsualización */}
        <div className="form-section">
          <h3>
            <i className="icon-location"></i> Ubicación
          </h3>
          <p className="section-description">Indica dónde ocurrió el incidente</p>
          
          <button
            type="button"
            className="location-button"
            onClick={handleElegirUbicacion}
          >
            <i className="icon-pin"></i> Seleccionar Ubicación
          </button>
          
          {ubicacion && (
            <div className="location-section">
              <div className="mini-map">
                {/* Aquí iría un componente de mapa miniaturizado */}
                <div className="map-placeholder">
                  <i className="icon-map"></i>
                </div>
              </div>
              <div className="location-details">
                <p className="coordinates">
                  <strong>Coordenadas:</strong> {ubicacion.lat.toFixed(4)}, {ubicacion.lng.toFixed(4)}
                </p>
                {ubicacion.referencia && (
                  <p className="reference">
                    <strong>Referencia:</strong> {ubicacion.referencia}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>


        {/* Sección de multimedia - más intuitiva */}
        <div className="form-section">
          <h3>
            <i className="icon-camera"></i> Subir evidencia
          </h3>
          <p className="section-description">Adjunta fotos o videos del incidente</p>
          
          <div className="media-upload-area" onClick={() => !media && fileInputRef.current.click()}>
            {media ? (
              <div className="media-preview">
                {mediaType === 'image' ? (
                  <img src={media} alt="Previsualización" />
                ) : (
                  <video controls>
                    <source src={media} type="video/mp4" />
                  </video>
                )}
                <button 
                  type="button" 
                  className="change-media-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMedia(null);
                  }}
                >
                  Cambiar archivo
                </button>
              </div>
            ) : (
              <div className="upload-prompt">
                <i className="icon-upload"></i>
                <p>Toca para subir una foto o video</p>
              </div>
            )}
          </div>
          
          <div className="media-options">
            <button 
              type="button" 
              onClick={openCamera} 
              className="media-button"
            >
              <i className="icon-camera"></i> Abrir Cámara
            </button>
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()} 
              className="media-button"
              >
              <i className="icon-gallery"></i> Elegir de Galería
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaChange}
              accept="image/*, video/*"
              style={{ display: 'none' }}
            />
          </div>
          {/* Aquí montamos el componente de cámara en un contenedor (puede ser modal) */}
          {showCamera && (
            <div className="camera-modal-overlay">
              <div className="camera-modal">
                <CameraComponent onCapture={handleCapture} />
                <button
                  type="button"
                  onClick={closeCamera}
                  className="close-camera-button"
                >
                  <i className="icon-close"></i> Cerrar Cámara
                </button>
              </div>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleMediaChange}
            accept="image/*, video/*"
            style={{ display: 'none' }}
          />
        </div>

        {/* Selección de tipo de alerta - con íconos y mejor diseño */}
        <div className="form-section">
          <h3>
            <i className="icon-alert"></i> Tipo de Alerta
          </h3>
          <p className="section-description">Selecciona la gravedad del incidente</p>
          
          <div className="alert-options-grid">
            <button
              type="button"
              className={`alert-option ${tipoAlerta === 'peligroso' ? 'danger active' : 'danger'}`}
              onClick={() => setTipoAlerta('peligroso')}
            >
              <i className="icon-danger"></i>
              <span>Peligroso</span>
              <p className="option-description">Situación de riesgo inminente</p>
            </button>
            
            <button
              type="button"
              className={`alert-option ${tipoAlerta === 'advertencia' ? 'warning active' : 'warning'}`}
              onClick={() => setTipoAlerta('advertencia')}
            >
              <i className="icon-warning"></i>
              <span>Advertencia</span>
              <p className="option-description">Posible situación de riesgo</p>
            </button>
            
            <button
              type="button"
              className={`alert-option ${tipoAlerta === 'informativo' ? 'info active' : 'info'}`}
              onClick={() => setTipoAlerta('informativo')}
            >
              <i className="icon-info"></i>
              <span>Informativo</span>
              <p className="option-description">Información relevante para la comunidad</p>
            </button>
          </div>
        </div>

        {/* Descripción - con contador de caracteres */}
        <div className="form-section">
          <h3>
            <i className="icon-description"></i> Descripción
          </h3>
          <p className="section-description">Describe con detalle lo ocurrido</p>
          
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ejemplo: 'Accidente vehicular en la esquina, dos autos involucrados, no hay heridos pero hay tráfico congestionado'"
            rows={4}
            maxLength={500}
          />
          <div className="char-counter">
            {descripcion.length}/500 caracteres
          </div>
        </div>


        {/* Botón de enviar - con estado de carga */}
        <button
          type="submit"
          className={`submit-button ${isSubmitting ? 'loading' : ''}`}
          disabled={!media || !tipoAlerta || !descripcion || !ubicacion || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <i className="icon-spinner"></i> Enviando...
            </>
          ) : (
            <>
              <i className="icon-send"></i> Enviar Alerta
            </>
          )}
        </button>

        {error && (
          <div className="error-message">
            <i className="icon-error"></i> {error}
          </div>
        )}
      </form>

      {/* Sección de reportes recientes */}
      <div className="recent-reports-section">
        <h3>
          <i className="icon-recent"></i> Reportes recientes en tu zona
        </h3>
        
        <div className="reports-grid">
          {reportesRecientes.map((reporte) => (
            <div key={reporte.id} className={`report-card ${reporte.tipo}`}>
              <div className="report-header">
                <span className={`tipo-badge ${reporte.tipo}`}>
                  {reporte.tipo === 'peligroso' && <i className="icon-danger"></i>}
                  {reporte.tipo === 'advertencia' && <i className="icon-warning"></i>}
                  {reporte.tipo === 'informativo' && <i className="icon-info"></i>}
                  {reporte.tipo}
                </span>
                <span className="report-time">{reporte.tiempo}</span>
              </div>
              <p className="report-desc">{reporte.descripcion}</p>
              <div className="report-footer">
                <span className="report-location">
                  <i className="icon-pin-small"></i> {reporte.distancia} km de ti
                </span>
                <div className="report-actions">
                  <button type="button" className="action-button confirm">
                    <i className="icon-check"></i> Confirmar ({reporte.confirmaciones})
                  </button>
                  <button type="button" className="action-button comment">
                    <i className="icon-comment"></i> Comentar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reportar;