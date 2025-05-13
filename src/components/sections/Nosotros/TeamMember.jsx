import React from "react";

const TeamMember = ({ member, animation }) => {
  return (
    <div
      style={{
        textAlign: "center",
        animation: `${animation} 4s ease-in-out infinite`,
      }}
    >
      <div style={memberStyles.imgContainer}>
        <img
          src={member.img}
          alt={member.name}
          style={memberStyles.img}
        />
      </div>
      <h3 style={memberStyles.name}>{member.name}</h3>
      <p style={memberStyles.role}>{member.role}</p>
      <p style={memberStyles.bio}>{member.bio}</p>
    </div>
  );
};

const memberStyles = {
  imgContainer: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    overflow: "hidden",
    margin: "0 auto var(--spacing-xs)",
    border: "3px solid var(--urbat-border)",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  name: {
    color: "var(--urbat-white)",
    margin: "var(--spacing-xs) 0",
  },
  role: {
    color: "var(--urbat-sky)",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  bio: {
    opacity: 0.8,
    fontSize: "0.9rem",
    padding: "0 var(--spacing-sm)",
  },
};

export default TeamMember;