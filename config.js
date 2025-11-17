// config.js - Configuración dinámica del backend
// Detecta entorno local vs producción (Railway mismo dominio)
// Local: usa puerto 5000 donde corre Flask
// Producción: rutas relativas (Railway expone /api/*)
const getBackendURL = () => {
    const host = window.location.hostname;
    const force = window.localStorage.getItem('FORCE_BACKEND_URL');
    if (force) return force; // Permite override manual para pruebas
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    return isLocal ? 'http://127.0.0.1:5000/api' : '/api';
};

const CONFIG = {
    BACKEND_URL: getBackendURL()
};

console.log(`🌐 Backend URL activo: ${CONFIG.BACKEND_URL}`);

// Helper para cambiar temporalmente el backend desde la consola:
// localStorage.setItem('FORCE_BACKEND_URL', 'http://127.0.0.1:5000/api'); location.reload();
// localStorage.removeItem('FORCE_BACKEND_URL'); location.reload();
