import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "leaflet/dist/leaflet.css";
import "./CrimePost.css";

// Corrige los íconos predeterminados de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/images/marker-shadow.png",
});

const CrimePost = ({ post, isReelMode = false }) => {
  const [isPlaying, setIsPlaying] = useState(isReelMode); // Inicia en play para modo reel
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [reactions, setReactions] = useState(post.reactions);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const videoRef = useRef(null);

  const handleReaction = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/reportes/${post.id}/reacciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tipo: type }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al registrar reacción");
      }

      const data = await response.json();
      setReactions((prev) => ({
        ...prev,
        [type]: data.reaccion ? prev[type] + 1 : Math.max(0, prev[type] - 1),
      }));
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/reportes/${post.id}/comentarios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ texto: newComment }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar comentario");
      }

      const data = await response.json();
      setComments((prev) => [data.comentario, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Pausar/reproducir video según visibilidad
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current && !entry.isIntersecting && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          } else if (
            videoRef.current &&
            entry.isIntersecting &&
            isReelMode &&
            !isPlaying
          ) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          }
        });
      },
      { threshold: 0.8 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, [isPlaying, isReelMode]);

  // Validar coordenadas
  const hasValidCoordinates =
    post.coordinates &&
    post.coordinates.lat &&
    post.coordinates.lng &&
    post.coordinates.lat >= -90 &&
    post.coordinates.lat <= 90 &&
    post.coordinates.lng >= -180 &&
    post.coordinates.lng <= 180;

  return (
    <div
      className={`crime-post ${isReelMode ? "reel-mode" : "list-mode"} ${
        post.tags[0]?.includes("peligroso")
          ? "danger"
          : post.tags[0]?.includes("advertencia")
          ? "warning"
          : "info"
      }`}
    >
      <div className="post-header">
        <div className="user-info">
          <img src={post.user.avatar} alt="Avatar" className="avatar" />
          <div>
            <p className="username">{post.user.name}</p>
            <div className="post-meta">
              <span className="timestamp">{post.timestamp}</span>
              <span className="location">{post.location}</span>
            </div>
          </div>
        </div>
        <button className="more-button">···</button>
      </div>

      <div className="post-body">
        {/* Columna izquierda: Multimedia, Mapa, Texto, Reacciones */}
        <div className="post-main">
          {/* Contenido multimedia */}
          {post.media ? (
            <div className="media-container">
              {post.media.type === "video" ? (
                <div className="video-wrapper">
                  <video
                    ref={videoRef}
                    src={post.media.url}
                    loop
                    muted={isMuted}
                    className="video"
                    onClick={togglePlay}
                  />
                  {!isPlaying && (
                    <div className="play-overlay" onClick={togglePlay}>
                      <svg className="play-icon" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" fill="white" />
                      </svg>
                    </div>
                  )}
                  <div className="video-controls">
                    <button onClick={toggleMute} className="control-button">
                      {isMuted ? "🔇" : "🔊"}
                    </button>
                    <button
                      onClick={() => setShowComments(!showComments)}
                      className="control-button"
                    >
                      💬 {comments.length}
                    </button>
                  </div>
                </div>
              ) : (
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="image-swiper"
                >
                  {post.media.urls.map((url, index) => (
                    <SwiperSlide key={index}>
                      <img src={url} alt={`Media ${index}`} className="post-image" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          ) : (
            <div className="no-media">
              <p>Reporte sin multimedia</p>
            </div>
          )}

          {/* Mapa */}
          {hasValidCoordinates ? (
            <div className="post-map">
              <MapContainer
                center={[post.coordinates.lat, post.coordinates.lng]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "150px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[post.coordinates.lat, post.coordinates.lng]}>
                  <Popup>{post.location}</Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <div className="no-map">
              <p>Ubicación no disponible</p>
            </div>
          )}

          {/* Texto */}
          <div className="post-content">
            <p className="post-text">
              {post.text.split(" ").map((word, i) =>
                word.startsWith("#") ? (
                  <span key={i} className="hashtag">{word} </span>
                ) : (
                  word + " "
                )
              )}
            </p>
          </div>

          {/* Reacciones */}
          <div className="reactions-bar">
            <button
              onClick={() => handleReaction("confirm")}
              className={`reaction-button ${reactions.confirm > 0 ? "active" : ""}`}
            >
              👍 <span>{reactions.confirm}</span>
            </button>
            <button
              onClick={() => handleReaction("deny")}
              className={`reaction-button ${reactions.deny > 0 ? "active" : ""}`}
            >
              👎 <span>{reactions.deny}</span>
            </button>
            <button
              onClick={() => handleReaction("care")}
              className={`reaction-button ${reactions.care > 0 ? "active" : ""}`}
            >
              ❤️ <span>{reactions.care}</span>
            </button>
            <button
              onClick={() => handleReaction("emergency")}
              className={`reaction-button ${
                reactions.emergency > 0 ? "active emergency" : ""
              }`}
            >
              ⛑️ <span>{reactions.emergency}</span>
            </button>
          </div>
        </div>

        {/* Columna derecha: Comentarios */}
        {!isReelMode && (
          <div className="comments-sidebar">
            <div className={`comments-section ${showComments ? "expanded" : ""}`}>
              {comments.length === 0 ? (
                <p className="no-comments">No hay comentarios aún</p>
              ) : (
                comments
                  .slice(0, showComments ? undefined : 5)
                  .map((comment) => (
                    <div key={comment.id} className="comment">
                      <img
                        src={comment.usuario_avatar || "/default-avatar.png"}
                        alt="Avatar"
                        className="comment-avatar"
                      />
                      <div className="comment-content">
                        <p className="comment-username">{comment.usuario_nombre}</p>
                        <p className="comment-text">{comment.texto}</p>
                        <p className="comment-time">
                          {new Date(comment.creado_en).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
              )}

              {comments.length > 5 && !showComments && (
                <button
                  onClick={() => setShowComments(true)}
                  className="view-comments"
                >
                  Ver todos los comentarios ({comments.length})
                </button>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="add-comment">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Añade un comentario..."
                className="comment-input"
              />
              <button type="submit" className="send-comment">
                Enviar
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Comentarios en modo TikTok (debajo) */}
      {isReelMode && (
        <div className={`comments-section ${showComments ? "expanded" : ""}`}>
          {comments.length === 0 ? (
            <p className="no-comments">No hay comentarios aún</p>
          ) : (
            comments
              .slice(0, showComments ? undefined : 2)
              .map((comment) => (
                <div key={comment.id} className="comment">
                  <img
                    src={comment.usuario_avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <p className="comment-username">{comment.usuario_nombre}</p>
                    <p className="comment-text">{comment.texto}</p>
                    <p className="comment-time">
                      {new Date(comment.creado_en).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
          )}

          {comments.length > 2 && !showComments && (
            <button
              onClick={() => setShowComments(true)}
              className="view-comments"
            >
              Ver todos los comentarios ({comments.length})
            </button>
          )}

          <form onSubmit={handleCommentSubmit} className="add-comment">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Añade un comentario..."
              className="comment-input"
            />
            <button type="submit" className="send-comment">
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CrimePost;