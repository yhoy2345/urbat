import React from 'react';
import { Outlet } from 'react-router-dom';
import Background from '../components/Background/Background';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function MainLayout() {
  return (
    <>
      <Background />
        <Header />
          <Outlet />
        <Footer />
    </>
  );
}
