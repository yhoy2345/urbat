import React, { useEffect, useRef } from 'react';
import './Background.css';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const UniversalGlobe = ({ children }) => {
  const globeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const svg = d3.select(globeRef.current);

    // Limpiar SVG previo
    svg.selectAll("*").remove();

    // Configuración de la proyección
    const projection = d3.geoOrthographic()
      .scale(Math.min(width, height) / 2.2)
      .translate([width / 2, height / 2])
      .rotate([-10, -15, 0])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);

    // Crear gradientes
    const defs = svg.append("defs");
    
    // Gradiente para el globo terrestre
    defs.append("radialGradient")
      .attr("id", "globe-gradient")
      .attr("cx", "30%")
      .attr("cy", "30%")
      .attr("r", "70%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#0a1a2a", opacity: 0.9 },
        { offset: "70%", color: "#040e18", opacity: 1 },
        { offset: "100%", color: "#02070b", opacity: 1 }
      ])
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color)
      .attr("stop-opacity", d => d.opacity);

    // Gradiente para la luna
    defs.append("radialGradient")
      .attr("id", "moon-gradient")
      .attr("cx", "30%")
      .attr("cy", "30%")
      .attr("r", "70%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#e0e0e0" },
        { offset: "70%", color: "#a0a0a0" },
        { offset: "100%", color: "#606060" }
      ])
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    // Filtros para efectos de brillo
    defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "blur");

    defs.append("filter")
      .attr("id", "moon-glow")
      .attr("x", "-30%")
      .attr("y", "-30%")
      .attr("width", "160%")
      .attr("height", "160%")
      .append("feGaussianBlur")
      .attr("stdDeviation", "2")
      .attr("result", "blur");

    // Base del globo terrestre
    svg.append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", projection.scale())
      .attr("fill", "url(#globe-gradient)")
      .attr("stroke", "#1e3a5a")
      .attr("stroke-width", 1.5)
      .attr("class", "globe-base");

    // Crear luna
    const moonSize = projection.scale() * 0.1;
    const moonX = width * 0.83;
    const moonY = height * 0.18;

    svg.append("circle")
      .attr("cx", width * 0.8)
      .attr("cy", height * 0.2)
      .attr("r", moonSize)
      .attr("fill", "url(#moon-gradient)")
      .attr("stroke", "#d0d0d0")
      .attr("stroke-width", 1)
      .attr("filter", "url(#moon-glow)")
      .attr("class", "moon");
    
    // Cráteres lunares
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * moonSize * 0.7;
        const craterX = moonX + Math.cos(angle) * radius;
        const craterY = moonY + Math.sin(angle) * radius;
        const craterSize = Math.random() * moonSize * 0.04 + moonSize * 0.01;
    
        svg.append("circle")
        .attr("cx", craterX)
        .attr("cy", craterY)
        .attr("r", craterSize)
        .attr("fill", "#aaa")
        .attr("stroke", "#666")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.6)
        .attr("filter", "url(#moon-glow)")
        .attr("class", "crater");
    }
  

    // Cargar datos del mapa
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json')
      .then(data => {
        const land = topojson.feature(data, data.objects.land);

        // Dibujar continentes con efecto 3D
        svg.append("path")
          .datum(land)
          .attr("d", path)
          .attr("fill", "#0c243d")
          .attr("stroke", "#1e3a5a")
          .attr("stroke-width", 0.8)
          .attr("class", "continents");

        // Efecto de brillo en los bordes
        svg.append("path")
          .datum(land)
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", "#3a6a9c")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0.7)
          .attr("class", "continent-glow");

        // Resaltar Sudamérica
        svg.append("path")
          .datum(land)
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", "#f8d45c")
          .attr("stroke-width", 1.2)
          .attr("stroke-dasharray", "2,2")
          .attr("class", "highlight-continent");

        // Animación de rotación
        const animate = () => {
          const time = Date.now() * 0.0001;
          projection.rotate([-10 + time * 15, -15, 0]);
          
          svg.selectAll(".continents").attr("d", path);
          svg.selectAll(".continent-glow").attr("d", path);
          svg.selectAll(".highlight-continent").attr("d", path);
          
          // Animación sutil de la luna
          const moonTime = Date.now() * 0.0005;
          svg.select(".moon")
            .attr("cx", width * 0.8 + Math.sin(moonTime) * 10)
            .attr("cy", height * 0.2 + Math.cos(moonTime * 0.7) * 5);
          
          animationRef.current = requestAnimationFrame(animate);
        };
        animate();
      });

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="universal-globe-container">
      <svg ref={globeRef} className="globe-svg"></svg>
      <div className="light-rays"></div>
      <div className="starfield"></div>
      {children}
    </div>
  );
};

export default UniversalGlobe;