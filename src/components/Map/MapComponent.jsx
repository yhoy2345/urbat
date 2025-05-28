import React, { useRef, useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Popup, useMap, Marker, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import AlertForm from '../sections/Reportar/AlertForm';
import DraggablePersonMarker from './MapMarcador';

// Configuración de iconos para Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Centro de Huánuco
const HUANUCO_CENTER = { lat: -9.9292, lng: -76.2397 };
const ZOOM_LEVEL = 15;
const MAX_GEOLOCATION_TIME = 3000;

// Componente para centrar el mapa
const CenterMap = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

// Componente para obtener ubicación (solo una vez)
const UserLocationTracker = ({ setUserPosition, setLocationError }) => {
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocalización no soportada');
      return;
    }

    let timeoutId;
    const options = { enableHighAccuracy: true, maximumAge: 0, timeout: MAX_GEOLOCATION_TIME };

    const handleSuccess = (position) => {
      clearTimeout(timeoutId);
      const { latitude, longitude } = position.coords;
      setUserPosition({ lat: latitude, lng: longitude });
    };

    const handleError = (error) => {
      clearTimeout(timeoutId);
      const errors = {
        [error.PERMISSION_DENIED]: 'Permiso denegado',
        [error.POSITION_UNAVAILABLE]: 'Ubicación no disponible',
        [error.TIMEOUT]: 'Tiempo de espera agotado'
      };
      setLocationError(`Error: ${errors[error.code] || 'Error desconocido'}`);
      
      if (options.enableHighAccuracy) {
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          () => setLocationError(`Error: ${errors[error.code] || 'Error desconocido'}`),
          { ...options, enableHighAccuracy: false }
        );
      }
    };

    timeoutId = setTimeout(() => {
      setLocationError('Tiempo de espera agotado');
    }, MAX_GEOLOCATION_TIME);

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    return () => clearTimeout(timeoutId);
  }, [setUserPosition, setLocationError]);

  return null;
};

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
  const [userPosition, setUserPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [markerDraggable, setMarkerDraggable] = useState(false);
  const [mapLocked, setMapLocked] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Función para alternar el modo arrastrar
  const toggleDragMode = useCallback(() => {
    if (!mapLocked) {
      setMarkerDraggable(prev => !prev);
    }
  }, [mapLocked]);

  // Función para desbloquear el mapa
  const unlockMap = useCallback(() => {
    setMapLocked(false);
    // Habilitar todas las interacciones del mapa
    if (mapRef.current) {
      mapRef.current.dragging.enable();
      mapRef.current.scrollWheelZoom.enable();
      mapRef.current.touchZoom.enable();
      mapRef.current.doubleClickZoom.enable();
      mapRef.current.boxZoom.enable();
      mapRef.current.keyboard.enable();
    }
  }, []);

  // Función para bloquear el mapa
  const lockMap = useCallback(() => {
    setMapLocked(true);
    // Deshabilitar todas las interacciones del mapa
    if (mapRef.current) {
      mapRef.current.dragging.disable();
      mapRef.current.scrollWheelZoom.disable();
      mapRef.current.touchZoom.disable();
      mapRef.current.doubleClickZoom.disable();
      mapRef.current.boxZoom.disable();
      mapRef.current.keyboard.disable();
    }
  }, []);

  // Controlar las interacciones del mapa según el estado de bloqueo
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return;

    if (mapLocked || markerDraggable) {
      lockMap();
    } else {
      unlockMap();
    }
  }, [mapLocked, markerDraggable, lockMap, unlockMap, mapInitialized]);

  useEffect(() => {
    if (!userPosition) return;
    setIsLoading(false);
    setLocationError(null);
    mapRef.current?.flyTo(userPosition, zoom);
  }, [userPosition, zoom]);

  useEffect(() => {
    if (locationError) {
      console.warn(locationError);
      setIsLoading(false);
      
      if (navigator.geolocation && !fallbackUsed) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => {
            setUserPosition(HUANUCO_CENTER);
            setFallbackUsed(true);
          },
          { enableHighAccuracy: false, maximumAge: 60000, timeout: 5000 }
        );
      } else if (!fallbackUsed) {
        setUserPosition(HUANUCO_CENTER);
        setFallbackUsed(true);
      }
    }
  }, [locationError, fallbackUsed]);

  // Manejar el click en el mapa
  const handleMapClick = useCallback((e) => {
    if (!mapLocked && onMapClick) {
      onMapClick(e);
    }
  }, [mapLocked, onMapClick]);

  // Inicializar el mapa con las interacciones bloqueadas
  const handleMapCreated = useCallback((map) => {
    mapRef.current = map;
    lockMap();
    setMapInitialized(true);
  }, [lockMap]);

  return (
    <div className="map-section">
      {isLoading && (
        <div className="map-loading-overlay">
          <div className="loading-spinner"></div>
          <p>Obteniendo tu ubicación...</p>
        </div>
      )}

      {locationError && (
        <div className="location-warning">
          <span>⚠️ {locationError}</span>
          {fallbackUsed && <span> Mostrando ubicación aproximada.</span>}
        </div>
      )}
      
      <div className="map-wrapper">
        <MapContainer 
          center={userPosition || HUANUCO_CENTER} 
          zoom={zoom} 
          className={`huanuco-map ${markerDraggable ? 'drag-mode-active' : ''} ${mapLocked ? 'map-locked' : ''}`}
          style={{ height: '610px', width: '100%' }}
          whenCreated={handleMapCreated}
          zoomControl={false} // Controlamos manualmente el zoom
          onClick={handleMapClick}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <UserLocationTracker 
            setUserPosition={setUserPosition} 
            setLocationError={setLocationError} 
          />

          <CenterMap center={userPosition} zoom={zoom} />

          {/* Controles personalizados */}
          {!mapLocked && (
            <div className="map-controls">
              <ZoomControl position="topright" />
              <div className="drag-toggle" onClick={toggleDragMode}>
                {markerDraggable ? 'Desactivar arrastre' : 'Mover mi ubicación'}
              </div>
            </div>
          )}

          {markerDraggable && (
            <div className="drag-message">
              Modo mover marcador activado - Haz click para desactivar
            </div>
          )}

          {userPosition && !isLoading && (
            <DraggablePersonMarker 
              position={userPosition} 
              setPosition={setUserPosition}
              setCurrentAddress={setCurrentAddress}
              currentAddress={currentAddress}
              draggable={markerDraggable && !mapLocked}
            />
          )}

          {alerts.map(alert => (
            <Marker
              key={alert.id}
              position={[alert.position.lat, alert.position.lng]}
              eventHandlers={{
                click: () => {
                  if (mapLocked) unlockMap();
                }
              }}
            >
              <Popup>
                <div>
                  <h4>{alert.type}</h4>
                  <p>{alert.description}</p>
                  <small>{alert.address}</small><br/>
                  <small>{alert.date}</small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {mapLocked && !isLoading && (
          <div className="map-overlay" onClick={unlockMap}>
            <div className="overlay-content">
              <div className="premium-title-container">
                <h3 className="premium-title">
                  <span className="title-text">
                    <span className="title-highlight">¡Haz clic</span> para explorar el mapa!
                  </span>
                </h3>
                <div className="title-afterglow"></div>
              </div>
              <p>Descubre alertas y muévete libremente.</p>
              <button className="unlock-button" onClick={unlockMap}>
                <span className="button-content">
                  <span className="button-text">Activar mapa</span>
                  <span className="button-icon-wrapper">
                    <svg className="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15V17M8 21H16C17.1046 21 18 20.1046 18 19V13C18 11.8954 17.1046 11 16 11H8C6.89543 11 6 11.8954 6 13V19C6 20.1046 6.89543 21 8 21ZM12 11C10.3431 11 9 9.65685 9 8V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V8C15 9.65685 13.6569 11 12 11Z" 
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="button-glow"></span>
                  </span>
                </span>
                <span className="button-sparkle-container">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="button-sparkle" style={{
                      '--delay': `${i * 0.1}s`,
                      '--sparkle-pos-x': `${Math.random() * 60 + 20}%`,
                      '--sparkle-pos-y': `${Math.random() * 100}%`
                    }}/>
                  ))}
                </span>
                <span className="button-backdrop"></span>
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <AlertForm
          defaultPosition={formPosition || userPosition || HUANUCO_CENTER}
          onSubmit={onFormSubmit}
          onCancel={onFormCancel}
          currentAddress={currentAddress}
        />
      )}
    </div>
  );
};

export default MapComponent;