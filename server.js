const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Servir archivos estáticos
app.use(express.static('.'));

// ============ FUNCIONES AUXILIARES ============

// Crear backup
function crearBackup(filePath) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = filePath.replace('.js', `.backup.${timestamp}.js`);
        if (fs.existsSync(filePath)) {
            fs.copyFileSync(filePath, backupPath);
            console.log(`💾 Backup creado: ${path.basename(backupPath)}`);
            limpiarBackupsAntiguos(filePath);
        }
    } catch (error) {
        console.error('Error creando backup:', error);
    }
}

// Mantener solo los últimos 5 backups
function limpiarBackupsAntiguos(filePath) {
    try {
        const dir = path.dirname(filePath);
        const fileName = path.basename(filePath, '.js');
        
        const archivos = fs.readdirSync(dir)
            .filter(f => f.startsWith(fileName) && f.includes('.backup.'))
            .map(f => ({
                nombre: f,
                ruta: path.join(dir, f),
                tiempo: fs.statSync(path.join(dir, f)).mtimeMs
            }))
            .sort((a, b) => b.tiempo - a.tiempo);
        
        if (archivos.length > 5) {
            archivos.slice(5).forEach(backup => {
                try {
                    fs.unlinkSync(backup.ruta);
                    console.log(`🗑️  Backup antiguo eliminado: ${backup.nombre}`);
                } catch (e) {
                    console.error(`Error al eliminar backup: ${e}`);
                }
            });
        }
    } catch (error) {
        console.error('Error limpiando backups:', error);
    }
}

// ============ RUTAS API - POEMAS ============

app.get('/api/poemas/get', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'poemas/poemas-data.js');
        delete require.cache[require.resolve(filePath)];
        const data = require(filePath);
        const poemas = data.poemas || data.POEMAS || [];
        
        res.json({
            success: true,
            poemas: poemas,
            count: poemas.length
        });
    } catch (error) {
        console.error('Error al leer poemas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/poemas/save', (req, res) => {
    try {
        const { poemas } = req.body;
        if (!poemas || !Array.isArray(poemas)) {
            return res.status(400).json({ success: false, error: 'Datos inválidos' });
        }
        
        const filePath = path.join(__dirname, 'poemas/poemas-data.js');
        crearBackup(filePath);
        
        const content = `const POEMAS = ${JSON.stringify(poemas, null, 2)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = { poemas: POEMAS, POEMAS };\n}`;
        fs.writeFileSync(filePath, content, 'utf8');
        
        console.log(`✅ ${poemas.length} poemas guardados`);
        
        res.json({
            success: true,
            message: 'Poemas guardados correctamente',
            total: poemas.length,
            count: poemas.length
        });
    } catch (error) {
        console.error('Error al guardar poemas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ RUTAS API - CANCIONES ============

app.get('/api/canciones/get', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'canciones/canciones-data.js');
        delete require.cache[require.resolve(filePath)];
        const data = require(filePath);
        const canciones = data.canciones || data.CANCIONES || [];
        
        res.json({
            success: true,
            canciones: canciones,
            count: canciones.length
        });
    } catch (error) {
        console.error('Error al leer canciones:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/canciones/save', (req, res) => {
    try {
        const { canciones } = req.body;
        if (!canciones || !Array.isArray(canciones)) {
            return res.status(400).json({ success: false, error: 'Datos inválidos' });
        }
        
        const filePath = path.join(__dirname, 'canciones/canciones-data.js');
        crearBackup(filePath);
        
        const content = `const CANCIONES = ${JSON.stringify(canciones, null, 2)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = { canciones: CANCIONES, CANCIONES };\n}`;
        fs.writeFileSync(filePath, content, 'utf8');
        
        console.log(`✅ ${canciones.length} canciones guardadas`);
        
        res.json({
            success: true,
            message: 'Canciones guardadas correctamente',
            total: canciones.length,
            count: canciones.length
        });
    } catch (error) {
        console.error('Error al guardar canciones:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ RUTAS API - MENSAJES ============

app.get('/api/mensajes/get', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'mensajes/mensajes-data.js');
        delete require.cache[require.resolve(filePath)];
        const data = require(filePath);
        const mensajes = data.mensajes || data.MENSAJES || [];
        
        res.json({
            success: true,
            mensajes: mensajes,
            count: mensajes.length
        });
    } catch (error) {
        console.error('Error al leer mensajes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/mensajes/save', (req, res) => {
    try {
        const { mensajes } = req.body;
        if (!mensajes || !Array.isArray(mensajes)) {
            return res.status(400).json({ success: false, error: 'Datos inválidos' });
        }
        
        const filePath = path.join(__dirname, 'mensajes/mensajes-data.js');
        crearBackup(filePath);
        
        const content = `const MENSAJES = ${JSON.stringify(mensajes, null, 2)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = { mensajes: MENSAJES, MENSAJES };\n}`;
        fs.writeFileSync(filePath, content, 'utf8');
        
        console.log(`✅ ${mensajes.length} mensajes guardados`);
        
        res.json({
            success: true,
            message: 'Mensajes guardados correctamente',
            total: mensajes.length,
            count: mensajes.length
        });
    } catch (error) {
        console.error('Error al guardar mensajes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ WEBHOOK ============

app.post('/webhook', (req, res) => {
    console.log('📬 Webhook recibido!');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    res.status(200).json({ 
        success: true, 
        message: 'Webhook recibido correctamente',
        timestamp: new Date().toISOString()
    });
});

app.get('/webhook', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Webhook endpoint está activo',
        method: 'Usa POST para enviar datos'
    });
});

// ============ RUTAS HTML ============

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

// ============ INICIAR SERVIDOR ============

app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 ========================================');
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log('🚀 ========================================');
    console.log(`📝 Poemas:    http://localhost:${PORT}/poemas`);
    console.log(`🎵 Canciones: http://localhost:${PORT}/canciones`);
    console.log(`💌 Mensajes:  http://localhost:${PORT}/mensajes`);
    console.log(`🔗 Webhook:   http://localhost:${PORT}/webhook`);
    console.log('🚀 ========================================');
});
