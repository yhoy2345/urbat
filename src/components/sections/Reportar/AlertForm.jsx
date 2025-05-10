import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import DraggablePersonMarker from './Marcador';
import './ReportarForm.css';

const FALLBACK_POSITION = { lat: -9.92945575, lng: -76.2397282419669 }; // Huánuco

const AlertForm = ({ defaultPosition = FALLBACK_POSITION, onSubmit, onCancel }) => {
  const [position, setPosition] = useState(defaultPosition);
  const [currentAddress, setCurrentAddress] = useState('');
  const [description, setDescription] = useState('');
  const [alertType, setAlertType] = useState('danger');
  const [isMapReady, setIsMapInitialized] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(true); // Nuevo estado para rastrear si se está obteniendo la ubicación
  const mapRef = useRef();

  // Maneja el clic en el mapa
  const MapClickHandler = ({ onClick }) => {
    useMapEvents({ click: e => onClick(e.latlng) });
    return null;
  };

  // Actualiza la posición y mueve el mapa
  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    if (mapRef.current) {
      mapRef.current.flyTo(newPosition);
    }
  };

  // Envía el reporte
  const handleSubmit = (e) => {
    e.preventDefault();
    const report = {
      id: Date.now(),
      position,
      address: currentAddress,
      description,
      type: alertType,
      date: new Date().toLocaleString(),
    };
    onSubmit(report);
  };

  // Obtiene la dirección al cambiar la posición
  useEffect(() => {
    if (!position) return;
    setIsGeocoding(true);
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`
    )
      .then(res => res.json())
      .then(data => {
        setCurrentAddress(data.display_name || '');
      })
      .catch(err => {
        console.error('Error geocoding:', err);
      })
      .finally(() => setIsGeocoding(false));
  }, [position]);

  // Obtiene la ubicación del usuario al cargar el componente
  useEffect(() => {
    setIsLocating(true); // Indica que se está buscando la ubicación

    const geolocationOptions = {
      enableHighAccuracy: true, // Mayor precisión (puede tardar más)
      timeout: 5000, // Máximo 5 segundos de espera
      maximumAge: 0, // No usar caché de ubicaciones anteriores
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const userPosition = { 
            lat: coords.latitude, 
            lng: coords.longitude 
          };
          setPosition(userPosition);
          if (mapRef.current) {
            mapRef.current.flyTo(userPosition, 15); // Mueve el mapa inmediatamente
          }
          setIsLocating(false); // Ya se obtuvo la ubicación
        },
        (err) => {
          console.warn('Geolocalización falló:', err);
          if (mapRef.current) {
            mapRef.current.flyTo(FALLBACK_POSITION, 15); // Mueve a Huánuco si falla
          }
          setIsLocating(false); // Terminó el proceso (aunque falló)
        },
        geolocationOptions
      );
    } else {
      console.warn('Geolocalización no soportada en este navegador');
      setIsLocating(false);
    }
  }, []);

  return (
    <div className="alert-form-overlay">
      <div className="alert-form-container">
        <button className="close-btn" onClick={onCancel} disabled={isLocating}>&times;</button>
        <h2>Reportar Incidente en Huánuco</h2>
        
        {/* Muestra un loader mientras se obtiene la ubicación */}
        {isLocating && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Obteniendo tu ubicación...</p>
          </div>
        )}

        <div className="map-preview">
          <MapContainer
            center={position}
            zoom={15}
            whenReady={() => setIsMapInitialized(true)}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {isMapReady && !isLocating && ( // No renderizar el marcador hasta tener la ubicación
              <>
                <MapClickHandler onClick={handlePositionChange} />
                <DraggablePersonMarker
                  position={position}
                  setPosition={handlePositionChange}
                  alertType={alertType}
                  currentAddress={currentAddress}
                  setCurrentAddress={setCurrentAddress}
                />
              </>
            )}
          </MapContainer>
        </div>

        {/* Resto del formulario (deshabilitado mientras se obtiene la ubicación) */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="premium-label">Tipo de Alerta:</label>
            <div className="select-wrapper">
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="premium-select with-icons"
              >
                <option value="danger">
                  <span className="option-content">
                    <svg className="option-icon" width="16" height="16" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2L1 21h22L12 2zm0 3.5L18.5 19h-13L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
                    </svg>
                    Peligroso 🚨 
                  </span>
                </option>
                <option value="warning">
                  <span className="option-content">
                    <svg className="option-icon" width="16" height="16" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2L1 21h22L12 2zm0 3.5L18.5 19h-13L12 5.5zM13 16h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>
                    Advertencia ⚠️ 
                  </span>
                </option>
                <option value="info">
                  <span className="option-content">
                    <svg className="option-icon" width="16" height="16" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    Informativo ℹ️ 
                  </span>
                </option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Dirección exacta:</label>
            <input
              type="text"
              value={isGeocoding ? "Buscando dirección..." : currentAddress}
              placeholder="Ej: Jr. Huánuco 123, Cercado"
              readOnly
              required
              disabled={isLocating} // Deshabilitado mientras carga
            />
            {isGeocoding && <small>...</small>}
          </div>

          <div className="form-group">
            <label>Puntos de Referencia:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe puntos referenciales..."
              required
              disabled={isLocating} // Deshabilitado mientras carga
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLocating} // Deshabilitado mientras carga
            >
              {isLocating ? "Cargando..." : "Enviar Ubicacion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertForm;