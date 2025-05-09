import React, { useState } from 'react';
import MapComponent from './MapComponent';
import PropTypes from 'prop-types';

const MapManager = () => {
  // Estado para los reportes
  const [alerts, setAlerts] = useState([]);
  
  // Estado para controlar el formulario
  const [showForm, setShowForm] = useState(false);
  const [formPosition, setFormPosition] = useState(null);

  // Manejar nuevo reporte
  const handleNewAlert = (alertData) => {
    // Validación de datos
    if (!alertData.position || !alertData.description) {
      console.error("Datos del reporte incompletos");
      return;
    }
    
    const newAlert = {
      ...alertData,
      id: Date.now(),
      date: new Date().toISOString()
    };
    
    setAlerts(prev => [...prev, newAlert]);
    setShowForm(false);
  };

  // Manejar clic en el mapa
  const handleMapClick = (latlng) => {
    setFormPosition([latlng.lat, latlng.lng]);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  console.log("[MapManager] ¿onFormSubmit es función?", typeof handleNewAlert);

  return (
    <div className="map-container">
      <MapComponent 
        alerts={alerts}
        onMapClick={handleMapClick}
        showForm={showForm}
        formPosition={formPosition}
        onFormSubmit={handleNewAlert}
        onFormCancel={handleCancel}    // ¡Y esta también!
      />
    </div>
  );
};

export default MapManager;


// Agrega al final del archivo:
MapManager.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      position: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }).isRequired,
      type: PropTypes.oneOf(['danger', 'warning', 'info']).isRequired,
      description: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ),
  showForm: PropTypes.bool,
  formPosition: PropTypes.arrayOf(PropTypes.number),
  onMapClick: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  onFormCancel: PropTypes.func.isRequired,
};