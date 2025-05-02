import React from 'react';
import { Outlet } from 'react-router-dom';
import Background from '../components/Background/Background';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function MainLayout() {
  return (
    <Background>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1
      }}>
        <Header />
        <main style={{ 
          flex: 1, 
          padding: '2rem',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto'
        }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </Background>
  );
}