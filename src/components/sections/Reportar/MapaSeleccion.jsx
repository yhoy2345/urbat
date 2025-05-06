import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
// eslint-disable-next-line no-unused-vars
import L from 'leaflet';  // <-- Para 'L'
import 'leaflet/dist/leaflet.css';

const MapaSeleccion = () => {
  const navigate = useNavigate();
  /* eslint-disable no-unused-vars */
  const { state } = useLocation();
  const [position, setPosition] = useState(null);
  const [referencia, setReferencia] = useState('');

  // Centro de Huánuco (coordenadas de ejemplo)
  const HUANUCO_CENTER = [-9.9292, -76.2397];
  const ZOOM_LEVEL = 13;

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });
    return null;
  };

  const handleConfirmar = () => {
    if (position) {
      navigate('/reportar', {
        state: {
          ubicacion: {
            lat: position.lat,
            lng: position.lng,
            referencia: referencia
          },
          fromMap: true
        }
      });
    } 
  };

  return (
    <div className="mapa-seleccion-container">
      <h2>Selecciona la ubicación en el mapa</h2>
      
      <div className="map-wrapper">
        <MapContainer 
          center={HUANUCO_CENTER} 
          zoom={ZOOM_LEVEL} 
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents />
          {position && (
            <Marker position={position}>
              <Popup>Ubicación seleccionada</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      <div className="referencia-input">
        <input
          type="text"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
          placeholder="Agregar referencia (opcional)"
        />
      </div>

      <div className="map-actions">
        <button 
          onClick={handleConfirmar}
          disabled={!position}
          className="confirm-button"
        >
          Confirmar Ubicación
        </button>
      </div>
    </div>
  );
};

export default MapaSeleccion;