const storage = require('../storage.js');
const fs = require('fs');
const path = require('path');

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
        const { canciones } = req.body;
        if (!canciones || !Array.isArray(canciones)) {
            return res.status(400).json({
                success: false,
                error: 'Datos inválidos'
            });
        }
        
        // Guardar en memoria
        storage.setCancionesGuardadas(canciones);
        
        // Intentar guardar también al archivo
        try {
            const filePath = path.join(__dirname, '../../canciones/canciones-data.js');
            const content = `const CANCIONES = ${JSON.stringify(canciones, null, 2)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = { canciones: CANCIONES, CANCIONES };\n}`;
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('✅ Canciones guardadas también al archivo');
        } catch (fileError) {
            console.log('⚠️ No se pudo guardar al archivo (normal en Vercel), guardadas en memoria:', fileError.message);
        }
        
        res.status(200).json({
            success: true,
            message: 'Canciones guardadas',
            total: canciones.length,
            count: canciones.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
