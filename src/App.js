import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Inicio from './components/sections/Inicio/Inicio';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import VerifyCode from './auth/VerifyCode';
import MapComponent from './components/Map/MapComponent';
import MapaSeleccion from './components/sections/Reportar/MapaSeleccion';
import Reportar from './components/sections/Reportar/Reportar'; 

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Inicio />} />
          <Route path="/mapa" element={<MapComponent />} />
          <Route path="/reportar" element={<Reportar />} />
          <Route path="/seleccionar-ubicacion" element={<MapaSeleccion />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}