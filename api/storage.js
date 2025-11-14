// Almacenamiento en memoria para Vercel
let poemasGuardados = null;
let cancionesGuardadas = null;
let mensajesGuardados = null;

// Cargar datos iniciales
try {
    const data = require('../../poemas/poemas-data.js');
    poemasGuardados = data.poemas || data.POEMAS || [];
} catch (e) {
    poemasGuardados = [];
}

try {
    const data = require('../../canciones/canciones-data.js');
    cancionesGuardadas = data.canciones || data.CANCIONES || [];
} catch (e) {
    cancionesGuardadas = [];
}

try {
    const data = require('../../mensajes/mensajes-data.js');
    mensajesGuardados = data.mensajes || data.MENSAJES || [];
} catch (e) {
    mensajesGuardados = [];
}

module.exports = {
    poemasGuardados,
    cancionesGuardadas,
    mensajesGuardados,
    setPoemasGuardados: (data) => { poemasGuardados = data; },
    setCancionesGuardadas: (data) => { cancionesGuardadas = data; },
    setMensajesGuardados: (data) => { mensajesGuardados = data; }
};
