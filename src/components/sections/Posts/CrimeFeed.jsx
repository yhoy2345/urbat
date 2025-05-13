
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import CrimePost from './CrimePost';
import CrimeMap from './CrimeMap'; // Componente de mapa que debes crear

const CrimeFeed = () => {
  const [isReelMode, setIsReelMode] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reportes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
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


   const transformData = (reportes) => {
    return reportes.map(reporte => ({
      id: reporte.id,
      user: {
        id: reporte.usuario_id,
        name: reporte.usuario_nombre,
        avatar: '/default-avatar.png' // Puedes añadir avatar a tu tabla usuarios
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
        confirm: 0, // Puedes añadir reacciones a tu BD
        deny: 0,
        care: 0,
        emergency: 0
      },
      comments: reporte.comentarios || [],
      tags: [`#${reporte.tipo_alerta}`, '#AlertaCiudadana'],
      coordinates: {
        lat: parseFloat(reporte.latitud),
        lng: parseFloat(reporte.longitud)
      }
    }));
  };

  // Función para formatear la fecha
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

  if (loading) return <div style={styles.loading}>Cargando reportes...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;



  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isReelMode ? '1fr' : 'minmax(0, 600px) 300px',
      gap: 'var(--spacing-md)',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 'var(--spacing-md)'
    }}>
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)'
        }}>
          <h2 style={{ color: 'var(--urbat-white)' }}>Alertas Recientes</h2>
          <button 
            onClick={() => setIsReelMode(!isReelMode)} 
            style={{
              background: 'var(--urbat-glass)',
              border: '1px solid var(--urbat-border)',
              color: 'var(--urbat-white)',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
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
            style={{ height: '90vh' }}
          >
            {posts.map(post => (
              <SwiperSlide key={post.id}>
                <CrimePost post={post} isReelMode={true} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          posts.map(post => (
            <CrimePost key={post.id} post={post} />
          ))
        )}
      </div>

      {!isReelMode && (
        <div style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
          <CrimeMap posts={posts} />
        </div>
      )}
    </div>
  );
};

export default CrimeFeed;