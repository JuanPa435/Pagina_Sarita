// ==================================
// CONFIGURACIÓN GLOBAL DEL PROYECTO
// ==================================

/**
 * Detecta el entorno (desarrollo/producción) y configura la URL del backend
 * - Desarrollo: Apunta a localhost:5000 (Flask local)
 * - Producción: Usa rutas relativas /api (Railway)
 */
const getBackendURL = () => {
    // Permitir override manual desde localStorage
    const force = window.localStorage.getItem('FORCE_BACKEND_URL');
    if (force) {
        console.log(`🔧 Override manual del backend: ${force}`);
        return force;
    }
    
    const host = window.location.hostname;
    const port = window.location.port;
    
    // Detectar entorno de desarrollo
    const isDev = host === 'localhost' || 
                  host === '127.0.0.1' || 
                  host.includes('github.dev') ||
                  host.includes('gitpod.io') ||
                  host.includes('codespaces') ||
                  (port !== '' && port !== '80' && port !== '443');
    
    if (isDev) {
        return 'http://127.0.0.1:5050/api';
    } else {
        return '/api';
    }
};

// Exportar configuración global
const CONFIG = {
    BACKEND_URL: getBackendURL(),
    VERSION: '2.0',
    PROJECT_NAME: 'Nuestra Historia 💙'
};

console.log(`🌐 Backend URL: ${CONFIG.BACKEND_URL}`);
console.log(`📍 Entorno: ${window.location.hostname}:${window.location.port}`);

// Helper para debug - cambiar backend desde consola del navegador:
// localStorage.setItem('FORCE_BACKEND_URL', 'http://127.0.0.1:5000/api'); location.reload();
// localStorage.removeItem('FORCE_BACKEND_URL'); location.reload();
