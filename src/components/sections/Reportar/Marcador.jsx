import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { Marker } from 'react-leaflet';
import './Marcador.css';

const DraggablePersonMarker = ({ position, setPosition, setCurrentAddress, currentAddress, draggable }) => {
  const markerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [showThought, setShowThought] = useState(false);
  const logoPath = '/images/bat.jpg';
  const [isGeocoding, setIsGeocoding] = useState(false);


  // Función para obtener la dirección desde coordenadas
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) throw new Error('Error en la respuesta');
      
      const data = await response.json();
      
      if (data.address) {
        // Construcción de dirección más detallada
        const { house_number, road, suburb, city, town, village, county, state, postcode } = data.address;
        
        const addressParts = [
          house_number ? `N° ${house_number}` : '',
          road,
          suburb || town || village,
          city || county,
          state,
          postcode ? `(${postcode})` : ''
        ].filter(part => part && part.trim() !== '');
        
        return addressParts.join(', ') || data.display_name || "Ubicación actual";
      }
      return data.display_name || "Ubicación actual";
    } catch (error) {
      console.error("Error al obtener dirección:", error);
      return "Ubicación no disponible";
    }
  };

  // Función para manejar el cambio de posición
  const handlePositionChange = async (newPosition) => {
    setIsGeocoding(true);
    try {
      const address = await getAddressFromCoords(newPosition.lat, newPosition.lng);
      setCurrentAddress(address);
      return address;
    } catch (error) {
      console.error("Error al geocodificar:", error);
      setCurrentAddress("No se pudo determinar la dirección");
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  // Actualizar dirección cuando cambia la posición
  const updateAddress = async (newPosition) => {
    const address = await getAddressFromCoords(newPosition.lat, newPosition.lng);
    setCurrentAddress(address);
  };

  // Icono personalizado del muñequito
  const personIcon = L.divIcon({
    className: `sharp-batman-marker ${isDraggingRef.current ? 'flying' : 'resting'}`,
    html: `

      <div class="batman-container">
        ${showThought ? 
          `<div class="thought-bubble">
            <div class="thought-text">Carajo MRDA!</div>
          </div>` 
          : ''
        }
        <div class="batman-cape"></div>
        <div class="batman-head">
          <div class="batman-ears">
            <div class="batman-ear left"></div>
            <div class="batman-ear right"></div>
          </div>
          <div class="batman-eyes">
            <div class="batman-eye left"></div>
            <div class="batman-eye right"></div>
          </div>
          <div class="batman-mouth"></div>
        </div>
        <div class="batman-body">
          <div class="batman-logo">
                <img src="${logoPath}" alt="Batman Logo" style="width: 24px; height: 24px;"/>
          </div>
          <div class="batman-arms">
            <div class="batman-arm left"></div>
            <div class="batman-arm right"></div>
          </div>
        </div>
        <div class="batman-legs">
          <div class="batman-leg left"></div>
          <div class="batman-leg right"></div>
          <div class="batman-boots"></div>
        </div>
        <div class="batman-shadow"></div>
        <div class="batman-light"></div>
      </div>
    `,
    iconSize: [40, 60],
    iconAnchor: [20, 60],
  });

  // Efecto para actualizar el marcador cuando cambia la posición
  useEffect(() => {
    if (markerRef.current && position) {
      markerRef.current.setLatLng(position);
      updateAddress(position);
    }
  }, [position]);

   // Efecto para ocultar el mensaje después de 2 segundos
   useEffect(() => {
    if (showThought) {
      const timer = setTimeout(() => {
        setShowThought(false);
        // Forzar actualización del icono
        if (markerRef.current) {
          markerRef.current.setIcon(personIcon);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showThought]);

  return (
    <>
      <Marker
        position={position}
        icon={personIcon}
        draggable={draggable}
        eventHandlers={{
          click: (e) => {
              // Verificar si el click fue en el logo
              if (e.originalEvent.target.closest('.batman-logo')) {
                setShowThought(true);
                // Actualizar el icono para mostrar el mensaje
                if (markerRef.current) {
                  markerRef.current.setIcon(personIcon);
                }
              }
          },
          dragstart: () => {
            isDraggingRef.current = true;
            if (markerRef.current) {
              markerRef.current._icon.classList.add('flying');
              markerRef.current._icon.classList.remove('resting');
            }
          },
          drag: async (e) => {
              const newPosition = e.target.getLatLng();
              setPosition(newPosition);
              await updateAddress(newPosition); // Actualizar dirección en tiempo real
          },
          dragend: async (e) => {
              isDraggingRef.current = false;
              const newPosition = e.target.getLatLng();
              const address = await handlePositionChange(newPosition);
              setPosition(newPosition);
              if (markerRef.current) {
                markerRef.current._icon.classList.add('landing');
                markerRef.current._icon.classList.remove('flying');
                setTimeout(() => {
                  if (markerRef.current?._icon) {
                    markerRef.current._icon.classList.remove('landing');
                    markerRef.current._icon.classList.add('resting');
                  }
                }, 800);
              }
              setPosition(newPosition);
              await updateAddress(newPosition); // Actualizar dirección final
          },
          mouseover: () => {
              if (markerRef.current) {
                  markerRef.current._icon.classList.add('hover');
              }
          },
          mouseout: () => {
              if (markerRef.current) {
                  markerRef.current._icon.classList.remove('hover');
              }
          }
        }}
        ref={(ref) => {
          markerRef.current = ref;
        }}
      />
      
    </>
  );
};
export default DraggablePersonMarker;