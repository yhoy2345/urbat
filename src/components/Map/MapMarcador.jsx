import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { Marker } from 'react-leaflet';
import './MapMarcador.css';

const MapMarcador = ({ position, draggable, setPosition }) => {
    const markerRef = useRef(null);
    const logoPath = '/images/bat.jpg';

    const BlackPulseIcon = L.divIcon({
        className: 'black-pulse-marker-icon',
        html: `
            <div class="pulse-container">
                <div class="pulse-wave pulse-wave-1"></div>
                <div class="pulse-wave pulse-wave-2"></div>
                <div class="pulse-wave pulse-wave-3"></div>
                <div class="pulse-core">
                    <div class="core-inner-glow"></div>
                    <img src="${logoPath}" alt="Ubicación" class="pulse-marker-img"/>
                </div>
                <div class="pulse-static-ring"></div>
            </div>
        `,
        iconSize: [180, 180],
        iconAnchor: [90, 90],
    });

    useEffect(() => {
        if (markerRef.current && position) {
            markerRef.current.setLatLng(position);
        }
    }, [position]);

    const eventHandlers = {
        drag: (e) => setPosition(e.target.getLatLng()),
        dragend: (e) => setPosition(e.target.getLatLng()),
    };

    return (
        <Marker
            position={position}
            icon={BlackPulseIcon}
            draggable={draggable}
            eventHandlers={eventHandlers}
            ref={(ref) => {
                markerRef.current = ref;
            }}
        />
    );
};

export default MapMarcador;