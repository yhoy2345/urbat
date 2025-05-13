import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Coordenadas centrales de Huánuco
const HUANUCO_CENTER = { lat: -9.92945575, lng: -76.2397282419669 };

// Componente para manejar los marcadores dinámicos
const DynamicMarkers = ({ posts, onMarkerClick }) => {
  const map = useMap();
  const markersRef = useRef({});

  useEffect(() => {
    // Limpiar marcadores anteriores
    Object.values(markersRef.current).forEach(marker => {
      if (marker) marker.remove();
    });
    markersRef.current = {};

    // Añadir nuevos marcadores
    posts.forEach(post => {
      if (post.coordinates) {
        const marker = L.marker(post.coordinates, {
          icon: createCustomIcon(post.alertType || 'info')
        })
          .addTo(map)
          .on('click', () => {
            if (onMarkerClick) onMarkerClick(post);
            map.flyTo(post.coordinates, 16);
          });

        markersRef.current[post.id] = marker;
      }
    });

    return () => {
      // Limpieza al desmontar
      Object.values(markersRef.current).forEach(marker => {
        if (marker) marker.remove();
      });
    };
  }, [posts, onMarkerClick, map]);

  return null;
};

// Componente para marcadores estáticos
const StaticMarkers = () => {
  return (
    <>
      <Marker position={[-9.9295, -76.2397]} icon={createCustomIcon('info')}>
        <Popup>Plaza de Armas de Huánuco</Popup>
      </Marker>
      <Marker position={[-9.9176, -76.2389]} icon={createCustomIcon('info')}>
        <Popup>Mercado Central</Popup>
      </Marker>
      <Marker position={[-9.9324, -76.2423]} icon={createCustomIcon('info')}>
        <Popup>Hospital Regional</Popup>
      </Marker>
    </>
  );
};

// Función para crear iconos personalizados
const createCustomIcon = (type) => {
  return L.divIcon({
    className: `custom-marker ${type}`,
    html: `<div class="marker-pin"></div><span class="marker-label">${type === 'danger' ? '⚠️' : 'ℹ️'}</span>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -36]
  });
};

const CrimeMap = ({ posts = [], onMarkerClick }) => {
  const [mapReady, setMapReady] = useState(false);

  return (
    <div className="crime-map-container">
      <MapContainer
        center={HUANUCO_CENTER}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {mapReady && (
          <>
            <StaticMarkers />
            <DynamicMarkers posts={posts} onMarkerClick={onMarkerClick} />
          </>
        )}
      </MapContainer>

      <div className="map-legend">
        <h4>Leyenda</h4>
        <div className="legend-item">
          <span className="marker-icon danger"></span>
          <span>Reporte reciente</span>
        </div>
        <div className="legend-item">
          <span className="marker-icon info"></span>
          <span>Punto de interés</span>
        </div>
      </div>
    </div>
  );
};

export default CrimeMap;