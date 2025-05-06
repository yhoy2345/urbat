import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const AlertForm = ({ onSubmit, onCancel, defaultPosition }) => {
  const [position, setPosition] = useState(defaultPosition);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [alertType, setAlertType] = useState('danger');

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setPosition(e.latlng);
      },
    });
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      position,
      address,
      description,
      type: alertType,
      date: new Date().toLocaleString()
    });
  };

  return (
    <div className="alert-form-overlay">
      <div className="alert-form-container">
        <h2>Reportar Incidente en Huánuco</h2>
        
        <div className="map-preview">
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler />
            {position && <Marker position={position} />}
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
              <option value="danger">Peligroso (Rojo)</option>
              <option value="warning">Advertencia (Amarillo)</option>
              <option value="info">Informativo (Azul)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Dirección exacta en Huánuco:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej: Jr. Huánuco 123, Cercado"
              required
            />
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
            <button type="button" onClick={onCancel}>Cancelar</button>
            <button type="submit">Enviar Reporte</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertForm;