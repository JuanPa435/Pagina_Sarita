// config.js - Configuración automática del backend
// Este archivo detecta automáticamente si estás en desarrollo o producción

const getBackendURL = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Si estás en localhost (desarrollo local)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }

    // En Vercel o cualquier hostname: usar URL actual
    // Todo corre en el mismo servidor
    return '/api';
};

const CONFIG = {
    BACKEND_URL: getBackendURL(),
    DEBUG: window.location.hostname === 'localhost'
};

console.log(`🌐 Backend URL: ${CONFIG.BACKEND_URL}`);
console.log(`🔧 Modo: ${CONFIG.DEBUG ? 'DESARROLLO' : 'PRODUCCIÓN'}`);

