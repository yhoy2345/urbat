// src/components/Background/Background.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Background.css';

const Background = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current, {
      center: [25, 10],
      zoom: 2.5,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true,
    });

    // Capa base nítida con colores naturales
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      detectRetina: true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Manejar redimensionamiento
    const handleResize = () => {
      map.invalidateSize({ animate: true });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      id="background-map" 
      className="background-map"
      aria-hidden="true"
    />
  );
};

export default Background;