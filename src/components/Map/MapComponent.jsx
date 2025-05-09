import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AlertMarker from '../sections/Reportar/AlertMarker';
import './Map.css';
import DraggablePersonMarker from '../sections/Reportar/Marcador';
import AlertForm from '../sections/Reportar/AlertForm'; // Asegúrate que la ruta sea correcta

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

console.log("[MapComponent] ¿onFormSubmit recibido?", typeof onFormSubmit);

// Centro de Huánuco
const HUANUCO_CENTER = [-9.9292, -76.2397];
const ZOOM_LEVEL = 13;

const MapComponent = ({ 
  alerts = [],
  center = HUANUCO_CENTER,
  zoom = ZOOM_LEVEL,
  showForm,
  formPosition,
  onMapClick,
  onFormSubmit,
  onFormCancel
}) => {
  const mapRef = useRef();
  
  return (
    <div className="map-section">
      <MapContainer 
        center={center || HUANUCO_CENTER} 
        zoom={zoom || ZOOM_LEVEL} 
        className="huanuco-map"
        style={{ height: '400px', width: '100%' }}
        whenCreated={(map) => { mapRef.current = map }}
        onClick={onMapClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <DraggablePersonMarker 
          position={center || HUANUCO_CENTER} 
          setPosition={() => {}}
          setCurrentAddress={() => {}}
        />

        {alerts.map(alert => (
          <AlertMarker
            key={alert.id}
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
        defaultPosition={formPosition}
        onSubmit={onFormSubmit}  // Función de MapManager
        onCancel={onFormCancel}  // Función de MapManager
        
        />
      )}
    </div>
  );
};

export default MapComponent;
