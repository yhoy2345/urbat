import React, { useState, useRef, useEffect } from 'react';

const CameraComponent = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' para frontal, 'environment' para trasera

  // Iniciar la cámara
  useEffect(() => {
    let mediaStream = null;

    const startCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
      } catch (err) {
        setError('No se pudo acceder a la cámara. Asegúrate de haber dado los permisos necesarios.');
        console.error("Error al acceder a la cámara:", err);
      }
    };

    startCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Capturar foto
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Dibujar la imagen del video en el canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convertir a data URL y llamar a la función onCapture
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      onCapture(dataUrl);
    }
  };

  // Cambiar entre cámaras frontal/trasera
  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="camera-container">
      {error ? (
        <div className="camera-error">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="camera-view"
          />
          <div className="camera-controls">
            <button 
              type="button" 
              onClick={capturePhoto}
              className="capture-button"
            >
              <i className="icon-camera"></i> Capturar Foto
            </button>
            <button 
              type="button" 
              onClick={toggleCamera}
              className="switch-camera-button"
            >
              <i className="icon-switch"></i> Cambiar Cámara
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraComponent;