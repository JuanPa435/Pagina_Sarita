const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3000;

// Función para crear backup (máximo 5 backups)
function crearBackup(filePath) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = filePath.replace('.js', `.backup.${timestamp}.js`);
        if (fs.existsSync(filePath)) {
            fs.copyFileSync(filePath, backupPath);
            console.log(`💾 Backup creado: ${backupPath}`);
            
            // Limpiar backups antiguos (mantener solo los últimos 5)
            limpiarBackupsAntiguos(filePath);
        }
    } catch (error) {
        console.error('Error creando backup:', error);
    }
}

// Función para mantener solo los últimos 5 backups
function limpiarBackupsAntiguos(filePath) {
    try {
        const dir = path.dirname(filePath);
        const fileName = path.basename(filePath, '.js');
        
        // Obtener todos los backups
        const archivos = fs.readdirSync(dir)
            .filter(f => f.startsWith(fileName) && f.includes('.backup.'))
            .map(f => ({
                nombre: f,
                ruta: path.join(dir, f),
                tiempo: fs.statSync(path.join(dir, f)).mtimeMs
            }))
            .sort((a, b) => b.tiempo - a.tiempo); // Ordenar por más reciente primero
        
        // Si hay más de 5, eliminar los antiguos
        if (archivos.length > 5) {
            const aEliminar = archivos.slice(5);
            aEliminar.forEach(backup => {
                fs.unlinkSync(backup.ruta);
                console.log(`🗑️ Backup antiguo eliminado: ${backup.nombre}`);
            });
        }
    } catch (error) {
        console.warn('⚠️ Error limpiando backups antiguos:', error.message);
    }
}

// Guardar poemas
app.post('/api/poemas/save', (req, res) => {
    try {
        const { poemas } = req.body;
        
        // Validar que poemas sea un array válido
        if (!Array.isArray(poemas) || poemas.length === 0) {
            console.warn('⚠️ Intento de guardar poemas inválidos:', poemas);
            return res.status(400).json({ success: false, error: 'Datos de poemas inválidos' });
        }
        
        const filePath = path.join(__dirname, '../poemas/poemas-data.js');
        
        // Leer poemas existentes del archivo (para logging)
        let poemasEnServidor = [];
        try {
            if (fs.existsSync(filePath)) {
                const contenido = fs.readFileSync(filePath, 'utf8');
                const match = contenido.match(/const POEMAS = (\[[\s\S]*?\]);/);
                if (match) {
                    poemasEnServidor = JSON.parse(match[1]);
                }
            }
        } catch (e) {
            console.warn('⚠️ No se pudieron leer poemas existentes del servidor:', e.message);
        }
        
        console.log(`📊 Poemas EN SERVIDOR: ${poemasEnServidor.length}, recibidos del cliente: ${poemas.length}`);
        
        // IMPORTANTE: Usar directamente los poemas del cliente (ya contienen todos los cambios)
        // El cliente es la fuente de verdad - si eliminó, edició o agregó, lo hizo localmente primero
        const poemasFinales = poemas;
        
        console.log(`✏️ Actualizando con los ${poemasFinales.length} poemas del cliente`);
        
        // Crear backup antes de guardar
        crearBackup(filePath);
        
        const content = `const POEMAS = ${JSON.stringify(poemasFinales, null, 2)};`;
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Poemas guardados correctamente. Total: ${poemasFinales.length} poemas`);
        res.json({ success: true, message: 'Poemas guardados correctamente', total: poemasFinales.length });
    } catch (error) {
        console.error('❌ Error al guardar poemas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Guardar canciones
app.post('/api/canciones/save', (req, res) => {
    try {
        const { canciones } = req.body;
        
        if (!Array.isArray(canciones) || canciones.length === 0) {
            console.warn('⚠️ Intento de guardar canciones inválidas:', canciones);
            return res.status(400).json({ success: false, error: 'Datos de canciones inválidos' });
        }
        
        const filePath = path.join(__dirname, '../canciones/canciones-data.js');
        crearBackup(filePath);
        
        const content = `const CANCIONES = ${JSON.stringify(canciones, null, 4)};`;
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Canciones guardadas correctamente (${canciones.length} canciones)`);
        res.json({ success: true, message: 'Canciones guardadas correctamente' });
    } catch (error) {
        console.error('❌ Error al guardar canciones:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Guardar mensajes
app.post('/api/mensajes/save', (req, res) => {
    try {
        const { mensajes } = req.body;
        
        if (!Array.isArray(mensajes) || mensajes.length === 0) {
            console.warn('⚠️ Intento de guardar mensajes inválidos:', mensajes);
            return res.status(400).json({ success: false, error: 'Datos de mensajes inválidos' });
        }
        
        const filePath = path.join(__dirname, '../mensajes/mensajes-data.js');
        crearBackup(filePath);
        
        const content = `const MENSAJES = ${JSON.stringify(mensajes, null, 4)};`;
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Mensajes guardados correctamente (${mensajes.length} mensajes)`);
        res.json({ success: true, message: 'Mensajes guardados correctamente' });
    } catch (error) {
        console.error('❌ Error al guardar mensajes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Backend online ✅' });
});

// Obtener poemas actuales del servidor
app.get('/api/poemas/get', (req, res) => {
    try {
        const filePath = path.join(__dirname, '../poemas/poemas-data.js');
        console.log(`📂 Buscando archivo: ${filePath}`);
        
        if (fs.existsSync(filePath)) {
            const contenido = fs.readFileSync(filePath, 'utf8');
            // Extraer el JSON del archivo JS
            // El archivo tiene formato: const POEMAS = [...];
            const match = contenido.match(/const\s+POEMAS\s*=\s*(\[[\s\S]*\]);/);
            if (match) {
                try {
                    const poemas = JSON.parse(match[1]);
                    if (Array.isArray(poemas) && poemas.length > 0) {
                        console.log(`✅ Retornando ${poemas.length} poemas`);
                        return res.json({ success: true, poemas });
                    }
                } catch (parseErr) {
                    console.error('❌ Error parseando JSON:', parseErr.message);
                }
            } else {
                console.warn('⚠️ No se encontró la expresión const POEMAS en el archivo');
            }
        }
        
        res.json({ success: false, poemas: [] });
    } catch (error) {
        console.error('❌ Error al obtener poemas:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
    console.log(`📝 Los datos se guardarán automáticamente con backups`);
});

