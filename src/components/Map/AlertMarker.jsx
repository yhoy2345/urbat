import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const AlertMarker = ({ position, type, description, address, date }) => {
  const getIcon = () => {
    const iconUrl = type === 'danger' 
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
      : type === 'warning'
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png'
      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';

    return new L.Icon({
      iconUrl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  return (
    <Marker position={position} icon={getIcon()}>
      <Popup>
        <div className="alert-popup">
          <h3>{type === 'danger' ? '🚨 Peligro' : type === 'warning' ? '⚠️ Advertencia' : 'ℹ️ Información'}</h3>
          <p><strong>Ubicación:</strong> {address}</p>
          <p><strong>Descripción:</strong> {description}</p>
          <p><strong>Fecha:</strong> {date}</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default AlertMarker;