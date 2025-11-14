// config.js - Configuración automática del backend
// Este archivo detecta automáticamente si estás en desarrollo o producción

const getBackendURL = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Si estás en localhost (desarrollo local con Python server)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Si es puerto 8080, el backend está en 3000
        if (window.location.port === '8080') {
            return 'http://localhost:3000/api';
        }
        // Si es puerto 3000, usa rutas relativas (Railway local o server.js)
        return '/api';
    }

    // En Railway o cualquier producción: usar rutas relativas
    return '/api';
};

const CONFIG = {
    BACKEND_URL: getBackendURL(),
    DEBUG: window.location.hostname === 'localhost'
};

console.log(`🌐 Backend URL: ${CONFIG.BACKEND_URL}`);
console.log(`🔧 Modo: ${CONFIG.DEBUG ? 'DESARROLLO' : 'PRODUCCIÓN'}`);

