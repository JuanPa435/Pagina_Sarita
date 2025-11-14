const fs = require('fs');
const path = require('path');

// Función para crear backup
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

// Función para mantener solo los últimos 5 backups
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

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        const { poemas } = req.body;
        if (!poemas || !Array.isArray(poemas)) {
            return res.status(400).json({
                success: false,
                error: 'Datos inválidos'
            });
        }
        
        const filePath = path.join(__dirname, '../../poemas/poemas-data.js');
        
        // Crear backup
        crearBackup(filePath);
        
        // Escribir el archivo con formato
        const content = `const POEMAS = ${JSON.stringify(poemas, null, 2)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = { poemas: POEMAS, POEMAS };\n}`;
        fs.writeFileSync(filePath, content, 'utf8');
        
        console.log(`✅ ${poemas.length} poemas guardados correctamente`);
        
        res.status(200).json({
            success: true,
            message: 'Poemas guardados correctamente',
            total: poemas.length,
            count: poemas.length
        });
    } catch (error) {
        console.error('Error al guardar poemas:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
