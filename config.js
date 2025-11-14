// config.js - Configuración automática del backend
// Este archivo detecta automáticamente si estás en desarrollo o producción

const getBackendURL = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Si estás en localhost (desarrollo local)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }

    // Si estás en Netlify (producción - URL del frontend)
    if (hostname.includes('netlify.app') || hostname.includes('vercel.app')) {
        // Tu backend está en Vercel, obtén la URL desde:
        // 1. Variable de entorno (configurada en Netlify)
        // 2. O usa la URL por defecto de Vercel
        
        // Si tienes variable de entorno:
        if (typeof BACKEND_API_URL !== 'undefined') {
            return BACKEND_API_URL;
        }
        
        // URL por defecto - CAMBIAR ESTO POR TU DOMINIO DE VERCEL
        // Después de deployar en Vercel, reemplaza esto por tu URL
        return 'https://pagina-sarita-backend.vercel.app/api';
    }

    // Por defecto
    return 'http://localhost:3000/api';
};

const CONFIG = {
    BACKEND_URL: getBackendURL(),
    DEBUG: window.location.hostname === 'localhost'
};

console.log(`🌐 Backend URL: ${CONFIG.BACKEND_URL}`);
console.log(`🔧 Modo: ${CONFIG.DEBUG ? 'DESARROLLO' : 'PRODUCCIÓN'}`);
