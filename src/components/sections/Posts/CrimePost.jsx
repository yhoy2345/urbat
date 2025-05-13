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
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [reactions, setReactions] = useState(post.reactions);
  const videoRef = useRef(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const handleReaction = (type) => {
    setReactions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Efecto para pausar video cuando no está en vista
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

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className={`crime-post ${isReelMode ? 'reel-mode' : ''}`} style={styles.post}>
      {/* Cabecera */}
      <div style={styles.postHeader}>
        <div style={styles.userInfo}>
          <img 
            src={post.user.avatar || '/default-avatar.png'} 
            alt="Avatar" 
            style={styles.avatar}
          />
          <div>
            <p style={styles.username}>{post.user.name || 'Anónimo'}</p>
            <div style={styles.postMeta}>
              <span style={styles.timestamp}>{post.timestamp}</span>
              <span style={styles.locationTag}>{post.location}</span>
            </div>
          </div>
        </div>
        <button style={styles.moreButton}>···</button>
      </div>

      {/* Contenido multimedia */}
      <div style={styles.mediaContainer}>
        {post.media.type === 'video' ? (
          <div style={styles.videoWrapper}>
            <video
              ref={videoRef}
              src={post.media.url}
              loop
              muted={isMuted}
              style={styles.video}
              onClick={togglePlay}
            />
            {!isPlaying && (
              <div style={styles.playOverlay} onClick={togglePlay}>
                <svg style={styles.playIcon} viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" fill="white" />
                </svg>
              </div>
            )}
            <div style={styles.videoControls}>
              <button onClick={toggleMute} style={styles.controlButton}>
                {isMuted ? '🔇' : '🔊'}
              </button>
              <button 
                onClick={() => setShowComments(!showComments)} 
                style={styles.controlButton}
              >
                💬
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.imageCarousel}>
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation
              thumbs={{ swiper: thumbsSwiper }}
            >
              {post.media.urls.map((url, index) => (
                <SwiperSlide key={index}>
                  <img src={url} alt={`Media ${index}`} style={styles.postImage} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div style={styles.carouselThumbs}>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={5}
                slidesPerView={4}
                freeMode
                watchSlidesProgress
              >
                {post.media.urls.map((url, index) => (
                  <SwiperSlide key={index}>
                    <img src={url} alt={`Thumb ${index}`} style={styles.thumbImage} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>

      {/* Texto descriptivo */}
      <div style={styles.postContent}>
        <p style={styles.postText}>
          {post.text.split(/(#[^\s]+)/g).map((part, i) => 
            part.startsWith('#') ? (
              <span key={i} style={styles.hashtag}>{part}</span>
            ) : (
              part
            )
          )}
        </p>
      </div>

      {/* Barra de reacciones */}
      <div style={styles.reactionsBar}>
        <button 
          onClick={() => handleReaction('confirm')} 
          style={styles.reactionButton}
        >
          👍 <span>{reactions.confirm}</span>
        </button>
        <button 
          onClick={() => handleReaction('deny')} 
          style={styles.reactionButton}
        >
          👎 <span>{reactions.deny}</span>
        </button>
        <button 
          onClick={() => handleReaction('care')} 
          style={styles.reactionButton}
        >
          ❤️ <span>{reactions.care}</span>
        </button>
        <button 
          onClick={() => handleReaction('emergency')} 
          style={{ ...styles.reactionButton, color: 'red' }}
        >
          ⛑️ <span>{reactions.emergency}</span>
        </button>
        <button style={styles.reactionButton}>
          🔗 <span>Compartir</span>
        </button>
      </div>

      {/* Zona de comentarios */}
      <div style={styles.commentsSection}>
        {post.comments.slice(0, showComments ? undefined : 2).map(comment => (
          <div key={comment.id} style={styles.comment}>
            <img 
              src={comment.user.avatar || '/default-avatar.png'} 
              alt="Avatar" 
              style={styles.commentAvatar}
            />
            <div>
              <p style={styles.commentUsername}>{comment.user.name}</p>
              <p style={styles.commentText}>{comment.text}</p>
              <p style={styles.commentTime}>{comment.timestamp}</p>
            </div>
          </div>
        ))}
        {post.comments.length > 2 && !showComments && (
          <button 
            onClick={() => setShowComments(true)} 
            style={styles.viewAllComments}
          >
            Ver todos los comentarios ({post.comments.length})
          </button>
        )}
        <div style={styles.addComment}>
          <input 
            type="text" 
            placeholder="Añade un comentario..." 
            style={styles.commentInput}
          />
          <button style={styles.sendCommentButton}>➤</button>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.postFooter}>
        <button style={styles.footerButton}>🗺️ Ver en mapa</button>
        <button style={styles.footerButton}>🔖 Guardar</button>
        <div style={styles.hashtags}>
          {post.tags.map(tag => (
            <span key={tag} style={styles.tag}>#{tag}</span>
          ))}
        </div>
      </div>

      {/* Modal de pantalla completa */}
      {showFullscreen && (
        <div style={styles.fullscreenModal}>
          <button 
            onClick={() => setShowFullscreen(false)} 
            style={styles.closeModalButton}
          >
            ✕
          </button>
          <video
            src={post.media.url}
            controls
            autoPlay
            style={styles.fullscreenVideo}
          />
        </div>
      )}
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