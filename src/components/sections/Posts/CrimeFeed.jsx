import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import CrimePost from './CrimePost';
import CrimeMap from './CrimeMap';

const CrimeFeed = () => {
  const [isReelMode, setIsReelMode] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autenticado');
        
        const response = await fetch('http://localhost:5000/api/reportes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener reportes');
        }
        
        const data = await response.json();
        setPosts(transformData(data));
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, []);

  // Transforma los datos de la API al formato esperado
  const transformData = (reportes) => {
    return reportes.map(reporte => ({
      id: reporte.id,
      user: {
        id: reporte.usuario_id,
        name: reporte.usuario_nombre,
        avatar: '/default-avatar.png'
      },
      timestamp: formatTime(reporte.creado_en),
      location: reporte.direccion || 'Ubicación no especificada',
      media: reporte.archivos && reporte.archivos.length > 0 ? {
        type: reporte.archivos[0].tipo,
        url: `http://localhost:5000${reporte.archivos[0].url}`,
        urls: reporte.archivos.map(a => `http://localhost:5000${a.url}`)
      } : null,
      text: `${reporte.descripcion}\n${reporte.referencia ? `Referencia: ${reporte.referencia}` : ''}`,
      reactions: {
        confirm: 0, // Se actualizará con datos reales
        deny: 0,
        care: 0,
        emergency: 0
      },
      comments: reporte.comentarios || [],
      tags: [`#${reporte.tipo_alerta}`],
      coordinates: {
        lat: parseFloat(reporte.latitud),
        lng: parseFloat(reporte.longitud)
      }
    }));
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diff = now - postDate;
    
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    
    if (diff < minute) return 'Hace unos segundos';
    if (diff < hour) return `Hace ${Math.floor(diff / minute)} minutos`;
    if (diff < day) return `Hace ${Math.floor(diff / hour)} horas`;
    return `Hace ${Math.floor(diff / day)} días`;
  };

  if (loading) return <div className="loading">Cargando reportes...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className={`crime-feed ${isReelMode ? 'reel-mode' : ''}`}>
      <div className="feed-header">
        <h2>Alertas Recientes</h2>
        <button 
          onClick={() => setIsReelMode(!isReelMode)}
          className="mode-toggle"
        >
          {isReelMode ? 'Modo Lista' : 'Modo Reel'}
        </button>
      </div>

      {isReelMode ? (
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          mousewheel
          className="reel-container"
        >
          {posts.map(post => (
            <SwiperSlide key={post.id}>
              <CrimePost post={post} isReelMode={true} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="feed-container">
          <div className="posts-list">
            {posts.map(post => (
              <CrimePost key={post.id} post={post} />
            ))}
          </div>
          <div className="map-sidebar">
            <CrimeMap posts={posts} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CrimeFeed;