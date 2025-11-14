// config.js - Configuración para Railway
const getBackendURL = () => {
    // En Railway, todo corre en el mismo servidor
    // Así que siempre usamos rutas relativas
    return '/api';
};

const CONFIG = {
    BACKEND_URL: getBackendURL()
};

console.log(`🌐 Backend URL: ${CONFIG.BACKEND_URL}`);
