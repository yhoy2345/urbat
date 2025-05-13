import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

SwiperCore.use([Navigation, Pagination, Thumbs]);

const CrimePost = ({ post, isReelMode = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [reactions, setReactions] = useState(post.reactions);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const videoRef = useRef(null);


  const handleReaction = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reportes/${post.id}/reacciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tipo: type })
      });

      if (!response.ok) {
        throw new Error('Error al registrar reacción');
      }

      const data = await response.json();
      setReactions(prev => ({
        ...prev,
        [type]: data.reaccion ? prev[type] + 1 : Math.max(0, prev[type] - 1)
      }));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reportes/${post.id}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ texto: newComment })
      });

      if (!response.ok) {
        throw new Error('Error al enviar comentario');
      }

      const data = await response.json();
      setComments(prev => [data.comentario, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Error:', err);
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

  // Pausar video cuando no está visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (videoRef.current && !entry.isIntersecting && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, [isPlaying]);

  return (
    <div className={`crime-post ${isReelMode ? 'reel-mode' : ''}`}>
      {/* Cabecera del post */}
      <div className="post-header">
        <div className="user-info">
          <img 
            src={post.user.avatar} 
            alt="Avatar" 
            className="avatar"
          />
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

      {/* Contenido multimedia */}
      {post.media ? (
        <div className="media-container">
          {post.media.type === 'video' ? (
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
                  {isMuted ? '🔇' : '🔊'}
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

      {/* Texto del post */}
      <div className="post-content">
        <p className="post-text">
          {post.text.split(' ').map((word, i) => 
            word.startsWith('#') ? (
              <span key={i} className="hashtag">{word}</span>
            ) : (
              word + ' '
            )
          )}
        </p>
      </div>

      {/* Reacciones */}
      <div className="reactions-bar">
        <button 
          onClick={() => handleReaction('confirm')} 
          className={`reaction-button ${reactions.confirm > 0 ? 'active' : ''}`}
        >
          👍 <span>{reactions.confirm}</span>
        </button>
        <button 
          onClick={() => handleReaction('deny')} 
          className={`reaction-button ${reactions.deny > 0 ? 'active' : ''}`}
        >
          👎 <span>{reactions.deny}</span>
        </button>
        <button 
          onClick={() => handleReaction('care')} 
          className={`reaction-button ${reactions.care > 0 ? 'active' : ''}`}
        >
          ❤️ <span>{reactions.care}</span>
        </button>
        <button 
          onClick={() => handleReaction('emergency')} 
          className={`reaction-button ${reactions.emergency > 0 ? 'emergency' : ''}`}
        >
          ⛑️ <span>{reactions.emergency}</span>
        </button>
      </div>

      {/* Comentarios */}
      <div className={`comments-section ${showComments ? 'expanded' : ''}`}>
        {comments.slice(0, showComments ? undefined : 2).map(comment => (
          <div key={comment.id} className="comment">
            <img 
              src={comment.usuario_avatar || '/default-avatar.png'} 
              alt="Avatar" 
              className="comment-avatar"
            />
            <div className="comment-content">
              <p className="comment-username">{comment.usuario_nombre}</p>
              <p className="comment-text">{comment.texto}</p>
              <p className="comment-time">{new Date(comment.creado_en).toLocaleString()}</p>

            </div>
          </div>
        ))}
        
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
    </div>
  );
};

// Estilos (puedes moverlos a CSS modules o styled-components)
const styles = {
  post: {
    background: 'var(--urbat-glass)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--urbat-border)',
    marginBottom: 'var(--spacing-md)',
    overflow: 'hidden',
    position: 'relative',
    '&.reel-mode': {
      width: '100%',
      height: '90vh',
      margin: '0 auto',
      maxWidth: '375px'
    }
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderBottom: '1px solid var(--urbat-border)'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-xs)'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  username: {
    fontWeight: '600',
    margin: '0',
    color: 'var(--urbat-white)'
  },
  postMeta: {
    display: 'flex',
    gap: 'var(--spacing-xs)',
    fontSize: '0.8rem',
    color: 'var(--color-text-faint)'
  },
  locationTag: {
    color: 'var(--urbat-sky)'
  },
  moreButton: {
    background: 'none',
    border: 'none',
    color: 'var(--urbat-white)',
    fontSize: '1.2rem',
    cursor: 'pointer'
  },
  mediaContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: '9/16',
    backgroundColor: '#000'
  },
  videoWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  playOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.3)',
    cursor: 'pointer'
  },
  playIcon: {
    width: '50px',
    height: '50px'
  },
  videoControls: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    display: 'flex',
    gap: '10px',
    zIndex: '10'
  },
  controlButton: {
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    color: 'white',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px'
  },
  imageCarousel: {
    width: '100%',
    height: '100%',
    '--swiper-pagination-color': 'var(--urbat-gold)',
    '--swiper-navigation-color': 'var(--urbat-gold)'
  },
  postImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  carouselThumbs: {
    padding: '5px',
    background: 'rgba(0,0,0,0.3)'
  },
  thumbImage: {
    width: '100%',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
    opacity: '0.6',
    transition: 'opacity 0.3s',
    '&:hover': {
      opacity: '1'
    },
    '&.swiper-slide-thumb-active': {
      opacity: '1',
      border: '2px solid var(--urbat-gold)'
    }
  },
  postContent: {
    padding: 'var(--spacing-sm) var(--spacing-md)'
  },
  postText: {
    margin: '0',
    color: 'var(--urbat-white)',
    lineHeight: '1.4'
  },
  hashtag: {
    color: 'var(--urbat-sky)',
    cursor: 'pointer'
  },
  reactionsBar: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 'var(--spacing-sm) 0',
    borderTop: '1px solid var(--urbat-border)',
    borderBottom: '1px solid var(--urbat-border)'
  },
  reactionButton: {
    background: 'none',
    border: 'none',
    color: 'var(--urbat-white)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    '& span': {
      fontSize: '0.8rem'
    }
  },
  commentsSection: {
    padding: 'var(--spacing-sm) var(--spacing-md)'
  },
  comment: {
    display: 'flex',
    gap: 'var(--spacing-xs)',
    marginBottom: 'var(--spacing-sm)'
  },
  commentAvatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  commentUsername: {
    margin: '0',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--urbat-white)'
  },
  commentText: {
    margin: '2px 0',
    fontSize: '0.9rem',
    color: 'var(--urbat-white)'
  },
  commentTime: {
    margin: '0',
    fontSize: '0.7rem',
    color: 'var(--color-text-faint)'
  },
  viewAllComments: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-faint)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    padding: '0',
    margin: 'var(--spacing-xs) 0'
  },
  addComment: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-xs)',
    marginTop: 'var(--spacing-sm)'
  },
  commentInput: {
    flex: '1',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid var(--urbat-border)',
    borderRadius: '20px',
    padding: '8px 12px',
    color: 'var(--urbat-white)',
    fontSize: '0.9rem',
    '&::placeholder': {
      color: 'var(--color-text-faint)'
    }
  },
  sendCommentButton: {
    background: 'var(--urbat-sky)',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    color: 'white',
    cursor: 'pointer'
  },
  postFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    background: 'rgba(0,0,0,0.2)'
  },
  footerButton: {
    background: 'none',
    border: 'none',
    color: 'var(--urbat-white)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  hashtags: {
    display: 'flex',
    gap: 'var(--spacing-xs)',
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },
  tag: {
    color: 'var(--urbat-sky)',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  fullscreenModal: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'black',
    zIndex: '1000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeModalButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    zIndex: '1001'
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
    maxWidth: '100vw',
    maxHeight: '100vh',
    objectFit: 'contain'
  }
};

export default CrimePost;