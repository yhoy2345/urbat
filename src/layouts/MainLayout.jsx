import React from 'react';
import { Outlet } from 'react-router-dom';
import Background from '../components/Background/Background';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className="app-root">
      <Background />
      <Header />
      <div className="content-wrapper">
        <Outlet /> {/* Aquí se renderizará Inicio.jsx */}
      </div>
      <Footer />
    </div>
  );
}