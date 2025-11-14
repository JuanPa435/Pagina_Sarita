const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Intentar cargar datos desde archivos JS
let poemasData = [];
let cancionesData = [];
let mensajesData = [];

try {
    const poemasModule = require('../poemas/poemas-data.js');
    poemasData = poemasModule.poemas || [];
} catch (e) {
    console.log('Poemas no disponibles:', e.message);
}

try {
    const cancionesModule = require('../canciones/canciones-data.js');
    cancionesData = cancionesModule.canciones || [];
} catch (e) {
    console.log('Canciones no disponibles:', e.message);
}

try {
    const mensajesModule = require('../mensajes/mensajes-data.js');
    mensajesData = mensajesModule.mensajes || [];
} catch (e) {
    console.log('Mensajes no disponibles:', e.message);
}

// ========== POEMAS ==========

app.get('/api/poemas/get', (req, res) => {
    res.json({
        success: true,
        poemas: poemasData,
        count: poemasData.length
    });
});

app.post('/api/poemas/save', (req, res) => {
    try {
        const { poemas } = req.body;
        poemasData = poemas || [];
        res.json({
            success: true,
            message: 'Poemas guardados en memoria',
            count: poemas.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========== CANCIONES ==========

app.get('/api/canciones/get', (req, res) => {
    res.json({
        success: true,
        canciones: cancionesData,
        count: cancionesData.length
    });
});

app.post('/api/canciones/save', (req, res) => {
    try {
        const { canciones } = req.body;
        cancionesData = canciones || [];
        res.json({
            success: true,
            message: 'Canciones guardadas en memoria',
            count: canciones.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========== MENSAJES ==========

app.get('/api/mensajes/get', (req, res) => {
    res.json({
        success: true,
        mensajes: mensajesData,
        count: mensajesData.length
    });
});

app.post('/api/mensajes/save', (req, res) => {
    try {
        const { mensajes } = req.body;
        mensajesData = mensajes || [];
        res.json({
            success: true,
            message: 'Mensajes guardados en memoria',
            count: mensajes.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        poemas: poemasData.length,
        canciones: cancionesData.length,
        mensajes: mensajesData.length
    });
});

// Para desarrollo local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Para Vercel (exportar como función serverless)
module.exports = app;
