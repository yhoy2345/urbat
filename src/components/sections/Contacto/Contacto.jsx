import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Contacto.css'; // Import your CSS styles
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// Icons (you would import actual SVG icons in a real project)
const SocialIcon = ({ children }) => (
  <div className="social-icon">{children}</div>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'suggestion'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          message: '',
          subject: 'suggestion'
        });
      }, 3000);
    }, 1500);
  };

  // Custom marker icon
  const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // Team data
  const teamMembers = [
    {
      id: 1,
      name: 'Yhoy Clemente',
      role: 'Desarrollador',
      bio: 'sin bio',
      linkedin: '#',
      github: '#',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH4AJhZ838_jtSJxv1Bbs0L3tO3TwEXpd_tg&s'
    },
    {
      id: 2,
      name: 'Leo Lucas',
      role: 'Desarrollador',
      bio: 'Sin bio',
      linkedin: '#',
      github: '#',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSjP0MvEaSXCXAbHsNGReOzvy2yO1eLKJrmA&s'
    },
    {
      id: 3,
      name: 'Leonel flores',
      role: 'Desarrollador',
      bio: 'Sin bio',
      linkedin: '#',
      github: '#',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7ZF8Tn77FfVASiVY_LosDi-qLWmRjpd-27w&s'
    }
  ];

  return (
    <section className="contact-section" id="contact">
      <div className="section-header">
        <h2>Contacto</h2>
        <p className="section-subtitle">Conéctate con nuestro equipo</p>
        <div className="divider"></div>
      </div>

      <div className="contact-container">
        {/* Contact Form */}
        <div className="contact-form-container">
          <h3>Envíanos un mensaje</h3>
          {isSubmitted ? (
            <div className="form-success">
              <svg className="checkmark" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
              <p>¡Gracias por tu mensaje! Te responderemos pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Motivo de contacto</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option value="suggestion">Sugerencia</option>
                  <option value="technical">Reporte técnico</option>
                  <option value="collaboration">Solicitud de colaboración</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="contact-info-container">
          <div className="contact-info">
            <h3>Información directa</h3>
            
            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div className="info-content">
                <h4>Correos electrónicos</h4>
                <p><a href="mailto:soporte@urbat.app">soporte@urbat.app</a></p>
                <p><a href="mailto:alianzas@urbat.app">alianzas@urbat.app</a></p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">📱</div>
              <div className="info-content">
                <h4>WhatsApp</h4>
                <p><a href="https://wa.me/1234567890">+51 914 679 650</a></p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">🏢</div>
              <div className="info-content">
                <h4>Oficina</h4>
                <p>Su cueva de lLeo, Distrito Tecnológico</p>
                <p>Ciudad Digital, CP 54321</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">🕒</div>
              <div className="info-content">
                <h4>Horario de atención</h4>
                <p>Lunes a Viernes</p>
                <p>10:00 a 20:00</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="social-media">
            <h4>Síguenos</h4>
            <div className="social-icons">
              <a href="#" className="social-link">
                <SocialIcon>🐦</SocialIcon>
                <span>Twitter/X</span>
              </a>
              <a href="#" className="social-link">
                <SocialIcon>📸</SocialIcon>
                <span>Instagram</span>
              </a>
              <a href="#" className="social-link">
                <SocialIcon>💼</SocialIcon>
                <span>LinkedIn</span>
              </a>
              <a href="#" className="social-link">
                <SocialIcon>👍</SocialIcon>
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <h3>Conoce al equipo</h3>
        <div className="team-grid">
          {teamMembers.map(member => (
            <div key={member.id} className="team-card">
              <div className="team-avatar">
                <img src={member.avatar} alt={member.name} />
              </div>
              <div className="team-info">
                <h4>{member.name}</h4>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
                <div className="team-links">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a href={member.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      

      {/* Final Message */}
      <div className="final-message">
        <div className="final-icon">🛡️</div>
        <p>Gracias por ayudarnos a hacer la ciudad más segura. Cada reporte cuenta.</p>
      </div>
    </section>
  );
};

export default ContactSection;