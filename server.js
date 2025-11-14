const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Rutas API
app.get('/api/poemas/get', require('./api/poemas/get.js'));
app.post('/api/poemas/save', require('./api/poemas/save.js'));

app.get('/api/canciones/get', require('./api/canciones/get.js'));
app.post('/api/canciones/save', require('./api/canciones/save.js'));

app.get('/api/mensajes/get', require('./api/mensajes/get.js'));
app.post('/api/mensajes/save', require('./api/mensajes/save.js'));

// Servir archivos HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/poemas', (req, res) => {
    res.sendFile(path.join(__dirname, 'poemas/poemas.html'));
});

app.get('/canciones', (req, res) => {
    res.sendFile(path.join(__dirname, 'canciones/canciones.html'));
});

app.get('/mensajes', (req, res) => {
    res.sendFile(path.join(__dirname, 'mensajes/mensajes.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📝 Poemas: http://localhost:${PORT}/poemas`);
    console.log(`🎵 Canciones: http://localhost:${PORT}/canciones`);
    console.log(`💌 Mensajes: http://localhost:${PORT}/mensajes`);
});
