import React from "react";
import TeamMember from "./TeamMember.jsx";

function AboutUs() {
    const teamMembers = [
        {
            id: 1,
            name: "Yhoy Clemente",
            role: "Desarrollador",
            bio: "Ex-agente de seguridad con 10+ anos protegiendo comunidades.",
            img: "/team/alex.jpg",
        },
        {
            id: 2,
            name: "Lucas Leo",
            role: "Desarrollador ",
            bio: "Especialista en geolocalizacion y mapas interactivos.",
            img: "/team/marta.jpg",
        },
        {
            id: 3,
            name: "Leonel Flores",
            role: "Desarrollador",
            bio: "Conector entre usuarios y autoridades locales.",
            img: "/team/carlos.jpg",
        },
    ];

    return (
        <section className="about-section" style={styles.section}>
            {/* Hero */}
            <div style={styles.hero}>
                <h1 style={{ ...styles.title, animation: "titleEntrance 1s ease-out" }}>
                    Seguridad <span style={styles.highlight}>Colaborativa</span>
                </h1>
                <p style={styles.subtitle}>
                    Creemos que la protección comienza con <strong>conexión</strong> y{" "}
                    <strong>tecnología</strong>.
                </p>
            </div>

            {/* Misión/Visión */}
            <div style={styles.missionGrid}>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Misión</h3>
                    <p style={styles.cardText}>
                        Empoderar a las comunidades para reducir el crimen mediante reportes
                        en tiempo real y datos verificados.
                    </p>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Visión</h3>
                    <p style={styles.cardText}>
                        Ser la red de seguridad vecinal más confiable de Latinoamérica para
                        2025.
                    </p>
                </div>
            </div>

            {/* Equipo */}
            <div style={styles.teamSection}>
                <h2 style={styles.sectionTitle}>Conoce al Equipo</h2>
                <div style={styles.teamGrid}>
                    {teamMembers.map((member) => (
                        <TeamMember
                            key={member.id}
                            member={member} />
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div style={styles.statsContainer}>
                <div style={styles.statItem}>
                    <span style={styles.statNumber}>10K+</span>
                    <span style={styles.statLabel}>Usuarios Activos</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statNumber}>92%</span>
                    <span style={styles.statLabel}>Reportes Verificados</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statNumber}>24/7</span>
                    <span style={styles.statLabel}>Monitoreo</span>
                </div>
            </div>
        </section>
    );
}

// Estilos en JS (usa tu sistema de diseño de :root)
const styles = {
  section: {
    padding: "var(--spacing-lg)",
    background: "var(--urbat-dark)",
    color: "var(--urbat-white)",
  },
  hero: {
    textAlign: "center",
    marginBottom: "var(--spacing-lg)",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "var(--spacing-sm)",
    background: "linear-gradient(to right, var(--urbat-gold), var(--urbat-sky))",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  highlight: {
    textShadow: "0 0 10px var(--urbat-glow)",
  },
  subtitle: {
    fontSize: "1.2rem",
    opacity: 0.9,
    maxWidth: "800px",
    margin: "0 auto",
  },
  missionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "var(--spacing-md)",
    margin: "var(--spacing-lg) 0",
  },
  card: {
    background: "var(--urbat-glass)",
    padding: "var(--spacing-md)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--urbat-border)",
    transition: "var(--transition-fast)",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
    },
  },
  cardTitle: {
    color: "var(--urbat-gold)",
    marginBottom: "var(--spacing-xs)",
  },
  cardText: {
    lineHeight: 1.6,
  },
  teamSection: {
    margin: "var(--spacing-lg) 0",
  },
  sectionTitle: {
    textAlign: "center",
    marginBottom: "var(--spacing-md)",
    position: "relative",
    ":after": {
      content: '""',
      display: "block",
      width: "100px",
      height: "3px",
      background: "var(--urbat-gold)",
      margin: "var(--spacing-xs) auto",
    },
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "var(--spacing-md)",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginTop: "var(--spacing-lg)",
    background: "var(--urbat-glass)",
    padding: "var(--spacing-md)",
    borderRadius: "var(--radius-lg)",
  },
  statItem: {
    textAlign: "center",
    padding: "var(--spacing-sm)",
  },
  statNumber: {
    display: "block",
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "var(--urbat-gold)",
    animation: "pulse 2s infinite",
  },
  statLabel: {
    fontSize: "0.9rem",
    opacity: 0.8,
  },
};

export default AboutUs;