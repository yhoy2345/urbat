  import React from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import MainLayout from './layouts/MainLayout';
  import { AuthProvider } from './context/AuthContext'; // Importa AuthProvider
  import Inicio from './components/sections/Inicio/Inicio';
  import Login from './auth/Login';
  import Register from './auth/Register';
  import ForgotPassword from './auth/ForgotPassword';
  import ResetPassword from './auth/ResetPassword';
  import VerifyCode from './auth/VerifyCode';
  import MapManager from './components/Map/MapManager';
  import Reportar from './components/sections/Reportar/Reportar'; 
  import Perfil from './components/sections/Perfil/Perfil'; 
  import ReportarForm from './components/sections/Reportar/AlertForm';
  import CrimeFeed from './components/sections/Posts/CrimeFeed';
  import AboutUs from './components/sections/Nosotros/AboutUs';

  import 'leaflet/dist/leaflet.css';
  import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
  import 'leaflet-defaulticon-compatibility';
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas (sin layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Rutas protegidas (con layout MainLayout) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Inicio />} />
            <Route path="mapa" element={<MapManager />} />
            <Route path="reportar" element={<Reportar />} />
            <Route path="reportar-form" element={<ReportarForm />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="posts" element={<CrimeFeed />} />
            <Route path="nosotros" element={<AboutUs />} />

            {/* Ruta para páginas no encontradas */}
            <Route path="*" element={<div>Página no encontrada</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
  }