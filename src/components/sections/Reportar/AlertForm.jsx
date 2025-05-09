import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import DraggablePersonMarker from './Marcador';
import './ReportarForm.css';

const FALLBACK_POSITION = { lat: -9.92945575, lng: -76.2397282419669 };
console.log("[AlertForm] ¿onSubmit recibido?", typeof onSubmit);
const AlertForm = ({ defaultPosition = FALLBACK_POSITION, onSubmit, onCancel  }) => {
  const [position, setPosition] = useState(defaultPosition || FALLBACK_POSITION);
  const [currentAddress, setCurrentAddress] = useState('');
  const [description, setDescription] = useState('');
  const [alertType, setAlertType] = useState('danger');
  const [isMapReady, setIsMapInitialized] = useState(false); 
  const [isGeocoding, setIsGeocoding] = useState(false);

  const MapClickHandler = ({ onClick }) => {
    useMapEvents({ click: e => onClick(e.latlng) });
    return null;
  };

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
    onSubmit(report);  // Esta es la función que debe venir del padre
  };
  


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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
      },
      err => console.warn('Geolocalización falló:', err),
    );
  }, []);

  return (
    <div className="alert-form-overlay">
      <div className="alert-form-container">
        <button className="close-btn" onClick={onCancel}>&times;</button>
        <h2>Reportar Incidente en Huánuco</h2>
        
        <div className="map-preview">
          <MapContainer
            center={position}
            zoom={15}
            whenReady={() => setIsMapInitialized(true)}
            style={{ height: '100%', width: '100%' }}

          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {isMapReady && (
              <>
                <MapClickHandler onClick={setPosition} />
                <DraggablePersonMarker
                  position={position}
                  setPosition={setPosition}
                  alertType={alertType}
                  currentAddress={currentAddress}
                  setCurrentAddress={setCurrentAddress}
                />
              </>
            )}
          </MapContainer>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de Alerta:</label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
              required
            >
              <option value="danger">Peligroso </option>
              <option value="warning">Advertencia </option>
              <option value="info">Informativo </option>
            </select>
          </div>

          <div className="form-group">
            <label>Dirección exacta:</label>
            <input
              type="text"
              value={isGeocoding ? "Buscando dirección..." : currentAddress}
              placeholder="Ej: Jr. Huánuco 123, Cercado"
              readOnly
              required
            />
            {isGeocoding && <small>Buscando dirección precisa...</small>}
          </div>

          <div className="form-group">
            <label>Descripción del incidente:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe lo sucedido..."
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Enviar Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertForm;