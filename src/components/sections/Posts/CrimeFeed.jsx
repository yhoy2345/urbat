import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./CrimeFeed.css";
import CrimePost from "./CrimePost";
import CrimeMap from "./CrimeMap"; // Ajusta la ruta según tu proyecto

const CrimeFeed = () => {
  const [isReelMode, setIsReelMode] = useState(true); // Inicia en modo TikTok
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No hay token de autenticación. Por favor inicia sesión.");
        }
        const response = await fetch("http://localhost:5000/api/reportes", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => errorData({}));
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            window.location.href = '/login';
            throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.");
          }
          throw new Error(
            errorData.message || `Error ${response.status}: ${response.statusText}`
          );
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("La respuesta del servidor no tiene el formato esperado");
        }
        setPosts(transformData(data));
      } catch (err) {
        console.error("Error al obtener reportes:", err);
        setError(err.message || 'Error desconocido al cargar reportes');
      } finally {
        setLoading(false);
      }
    };
    fetchReportes();
  }, []);

  const transformData = (reportes) => {
    if (!reportes || !Array.isArray(reportes)) return [];

    return reportes.map((reporte) => ({
      id: reporte.id,
      user: {
        id: reporte.usuario_id,
        name: reporte.usuario_nombre || "Usuario desconocido",
        avatar: "/default-avatar.png",
      },
      timestamp: formatTime(reporte.creado_en),
      location: reporte.direccion || "Ubicación no especificada",
      media:
        reporte.archivos && reporte.archivos.length > 0
          ? {
            type: reporte.archivos[0].tipo,
            url: `http://localhost:5000${reporte.archivos[0].url}`,
            urls: reporte.archivos.map((a) => `http://localhost:5000${a.url}`),
          }
          : null,
      text: `${reporte.descripcion}${reporte.referencia ? ` Referencia: ${reporte.referencia}` : ""}`,
      reactions: reporte.reacciones || {
        confirm: 0,
        deny: 0,
        care: 0,
        emergency: 0,
      },
      comments: reporte.comentarios || [],
      tags: [`#${reporte.tipo_alerta}`],
      coordinates: {
        lat: parseFloat(reporte.latitud) && reporte.latitud >= -90 && reporte.latitud <= 90
          ? parseFloat(reporte.latitud)
          : -34.6037, // Fallback: Buenos Aires
        lng:
          parseFloat(reporte.longitud) && reporte.longitud >= -180 && reporte.longitud <= 180
            ? parseFloat(reporte.longitud)
            : -58.3816,
      },
    }));
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diff = now - postDate;
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    
    if (diff < minute) return "Hace unos segundos";
    if (diff < hour) return `Hace ${Math.floor(diff / minute)} minutos`;
    if (diff < day) return `Hace ${Math.floor(diff / hour)} horas`;
    return `Hace ${Math.floor(diff / day)} días`;
};

  if (loading) return <div className="loading">Cargando reportes...</div>;
  if (error) return <div className="error-message">Error: ${error}</div>;

  return (
    <div className={`crime-feed ${isReelMode ? "reel-mode" : ""}`}>
      <div className="feed-header">
        <h2>Alertas Recientes</h2>
        <button
          onClick={() => setIsReelMode(!isReelMode)}
          className="mode-toggle"
        >
          {isReelMode ? "Modo Lista" : "Modo TikTok"}
        </button>
      </div>

      {isReelMode ? (
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          mousewheel
          pagination={{ clickable: true }}
          modules={[Mousewheel, Pagination]}
          className="reel-container"
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id}>
              <CrimePost post={post} isReelMode={true} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="feed-container">
          <div className="posts-list">
            {posts.map((post) => (
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