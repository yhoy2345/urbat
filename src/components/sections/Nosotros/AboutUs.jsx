import { motion } from 'framer-motion';
import MapComponent from '../../Map/MapComponent';
import './AboutUs.css';
import 'leaflet/dist/leaflet.css';

const AboutUsSection = () => {
  const features = [
    {
      icon: '🚨',
      title: 'Empoderamiento ciudadano',
      description: 'Todos pueden ser parte de la solución'
    },
    {
      icon: '⏱️',
      title: 'Tiempo real',
      description: 'La información llega cuando importa'
    },
    {
      icon: '🤝',
      title: 'Confiabilidad comunitaria',
      description: 'Validación entre pares'
    },
    {
      icon: '🗺️',
      title: 'Mapeo inteligente',
      description: 'Tendencias delictivas visibles con un clic'
    }
  ];

  return (
    <section className="about-us-section">
      {/* Hero Section */}
      <div className="hero-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1>Más que una app. Somos Urbat.</h1>
          <p className="hero-subtitle">Tecnología barrial en tiempo real. Seguridad construida por la comunidad.</p>
          <div className="hero-scroll-indicator">
            <span></span>
          </div>
        </motion.div>
        <div className="hero-background"></div>
      </div>

      {/* What is Urbat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="content-section what-is-section"
      >
        <div className="section-header">
          <span className="section-icon">🌐</span>
          <h2>¿Qué hacemos?</h2>
        </div>
        <div className="section-content">
          <p>
            Urbat es una plataforma web de alerta comunitaria que permite a cualquier ciudadano reportar, visualizar y validar incidentes delictivos en tiempo real. Nuestro enfoque es descentralizar la seguridad urbana y poner el poder de la información en manos de las personas.
          </p>
          <p>
            A través de tecnología geolocalizada, notificaciones instantáneas y validación comunitaria, buscamos crear una red inteligente que proteja al barrio desde adentro.
          </p>
          <div className="animated-icons">
            <div className="icon-item">
              <div className="icon-circle">🧠</div>
              <span>Comunidad</span>
            </div>
            <div className="icon-item">
              <div className="icon-circle">📍</div>
              <span>Mapa</span>
            </div>
            <div className="icon-item">
              <div className="icon-circle">📢</div>
              <span>Alerta</span>
            </div>
            <div className="icon-item">
              <div className="icon-circle">🔒</div>
              <span>Seguridad</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Origin Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="content-section origin-section"
      >
        <div className="section-header">
          <span className="section-icon">🧬</span>
          <h2>Nuestro origen</h2>
        </div>
        <div className="section-content">
          <p>
            Urbat surgió como respuesta a una pregunta sencilla: ¿y si pudiéramos anticiparnos al peligro? En un contexto donde los canales oficiales son lentos o inexistentes, decidimos crear una herramienta digital hecha por y para la comunidad.
          </p>
          <p>
            Empezamos con un prototipo durante noches de código, escuchando historias reales de vecinos, y comprendiendo que la mejor defensa no siempre es una patrulla, sino una red conectada.
          </p>
          <div className="before-after">
            <div className="before">
              <h4>Antes</h4>
              <ul>
                <li>Información fragmentada</li>
                <li>Respuestas lentas</li>
                <li>Sensación de vulnerabilidad</li>
              </ul>
            </div>
            <div className="arrow">→</div>
            <div className="after">
              <h4>Con Urbat</h4>
              <ul>
                <li>Red comunitaria activa</li>
                <li>Alertas en tiempo real</li>
                <li>Empoderamiento colectivo</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Why Urbat Matters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="content-section why-matters-section"
      >
        <div className="section-header">
          <span className="section-icon">💡</span>
          <h2>¿Por qué existimos?</h2>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="feature-card"
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Map Section */}

      <MapComponent />


      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="cta-section"
      >
        <h3>"Cuando el barrio se conecta, el miedo se desconecta."</h3>
        <div className="cta-buttons">
          <button className="primary-button">Explora los reportes en tu zona</button>
          <button className="secondary-button">Únete a la red Urbat</button>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutUsSection;