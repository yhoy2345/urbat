import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AlertMarker from './AlertMarker';
import AlertForm from './AlertForm';
import './Map.css';

// Centro de Huánuco
const HUANUCO_CENTER = [-9.9292, -76.2397];
const ZOOM_LEVEL = 13;

const MapComponent = () => {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Simulación de conexión en tiempo real (en producción sería WebSockets)
  useEffect(() => {
    const socketSimulation = setInterval(() => {
      // Aquí iría la conexión real con el backend
      console.log("Escuchando nuevos reportes...");
    }, 5000);

    return () => clearInterval(socketSimulation);
  }, []);

  // Manejar nuevo reporte
  const handleNewAlert = (newAlert) => {
    setAlerts([...alerts, newAlert]);
    setShowForm(false);
  };

  return (
    <div className="map-section">
      <div className="map-controls">
        <button 
          onClick={() => setShowForm(true)}
          className="report-button"
        >
          Reportar Incidente
        </button>
      </div>

      <MapContainer 
        center={HUANUCO_CENTER} 
        zoom={ZOOM_LEVEL} 
        className="huanuco-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {alerts.map((alert, index) => (
          <AlertMarker 
            key={index}
            position={alert.position}
            type={alert.type}
            description={alert.description}
            address={alert.address}
            date={alert.date}
          />
        ))}
      </MapContainer>

      {showForm && (
        <AlertForm 
          onSubmit={handleNewAlert}
          onCancel={() => setShowForm(false)}
          defaultPosition={HUANUCO_CENTER}
        />
      )}
    </div>
  );
};

export default MapComponent;