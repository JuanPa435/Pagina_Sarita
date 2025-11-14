const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// ========== POEMAS ==========

// GET - Obtener todos los poemas
app.get('/api/poemas/get', (req, res) => {
    try {
        const filePath = path.join(__dirname, '../poemas/poemas-data.js');
        
        // Si el archivo no existe, crear uno vacío
        if (!fs.existsSync(filePath)) {
            const dataDefault = 'const poemas = [];';
            fs.writeFileSync(filePath, dataDefault, 'utf8');
        }
        
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Extraer el array de poemas del archivo
        const match = fileContent.match(/const poemas = (\[[\s\S]*?\]);/);
        const poemas = match ? JSON.parse(match[1]) : [];
        
        res.json({
            success: true,
            data: poemas,
            count: poemas.length
        });
    } catch (error) {
        console.error('Error al obtener poemas:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST - Guardar poemas
app.post('/api/poemas/save', (req, res) => {
    try {
        const { poemas } = req.body;
        const filePath = path.join(__dirname, '../poemas/poemas-data.js');
        
        // Crear backup
        crearBackup(filePath);
        
        // Escribir el archivo con formato
        const fileContent = `const poemas = ${JSON.stringify(poemas, null, 2)};`;
        fs.writeFileSync(filePath, fileContent, 'utf8');
        
        res.json({
            success: true,
            message: 'Poemas guardados correctamente',
            count: poemas.length
        });
    } catch (error) {
        console.error('Error al guardar poemas:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========== CANCIONES ==========

// GET - Obtener todas las canciones
app.get('/api/canciones/get', (req, res) => {
    try {
        const filePath = path.join(__dirname, '../canciones/canciones-data.js');
        
        // Si el archivo no existe, crear uno vacío
        if (!fs.existsSync(filePath)) {
            const dataDefault = 'const canciones = [];';
            fs.writeFileSync(filePath, dataDefault, 'utf8');
        }
        
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Extraer el array de canciones del archivo
        const match = fileContent.match(/const canciones = (\[[\s\S]*?\]);/);
        const canciones = match ? JSON.parse(match[1]) : [];
        
        res.json({
            success: true,
            data: canciones,
            count: canciones.length
        });
    } catch (error) {
        console.error('Error al obtener canciones:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST - Guardar canciones
app.post('/api/canciones/save', (req, res) => {
    try {
        const { canciones } = req.body;
        const filePath = path.join(__dirname, '../canciones/canciones-data.js');
        
        // Crear backup
        crearBackup(filePath);
        
        // Escribir el archivo con formato
        const fileContent = `const canciones = ${JSON.stringify(canciones, null, 2)};`;
        fs.writeFileSync(filePath, fileContent, 'utf8');
        
        res.json({
            success: true,
            message: 'Canciones guardadas correctamente',
            count: canciones.length
        });
    } catch (error) {
        console.error('Error al guardar canciones:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========== MENSAJES ==========

// GET - Obtener todos los mensajes
app.get('/api/mensajes/get', (req, res) => {
    try {
        const filePath = path.join(__dirname, '../mensajes/mensajes-data.js');
        
        // Si el archivo no existe, crear uno vacío
        if (!fs.existsSync(filePath)) {
            const dataDefault = 'const mensajes = [];';
            fs.writeFileSync(filePath, dataDefault, 'utf8');
        }
        
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Extraer el array de mensajes del archivo
        const match = fileContent.match(/const mensajes = (\[[\s\S]*?\]);/);
        const mensajes = match ? JSON.parse(match[1]) : [];
        
        res.json({
            success: true,
            data: mensajes,
            count: mensajes.length
        });
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST - Guardar mensajes
app.post('/api/mensajes/save', (req, res) => {
    try {
        const { mensajes } = req.body;
        const filePath = path.join(__dirname, '../mensajes/mensajes-data.js');
        
        // Crear backup
        crearBackup(filePath);
        
        // Escribir el archivo con formato
        const fileContent = `const mensajes = ${JSON.stringify(mensajes, null, 2)};`;
        fs.writeFileSync(filePath, fileContent, 'utf8');
        
        res.json({
            success: true,
            message: 'Mensajes guardados correctamente',
            count: mensajes.length
        });
    } catch (error) {
        console.error('Error al guardar mensajes:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========== UTILIDADES ==========

function crearBackup(filePath) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = filePath.replace('.js', `.backup.${timestamp}.js`);
        if (fs.existsSync(filePath)) {
            fs.copyFileSync(filePath, backupPath);
            console.log(`💾 Backup creado: ${backupPath}`);
            limpiarBackupsAntiguos(filePath);
        }
    } catch (error) {
        console.error('Error creando backup:', error);
    }
}

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
            const aEliminar = archivos.slice(5);
            aEliminar.forEach(backup => {
                try {
                    fs.unlinkSync(backup.ruta);
                    console.log(`🗑️ Backup antiguo eliminado: ${backup.nombre}`);
                } catch (e) {
                    console.error(`Error al eliminar backup: ${e}`);
                }
            });
        }
    } catch (error) {
        console.error('Error limpiando backups:', error);
    }
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Para desarrollo local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Para Vercel (exportar como función serverless)
module.exports = app;
