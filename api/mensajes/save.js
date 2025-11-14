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
        const { mensajes } = req.body;
        if (!mensajes || !Array.isArray(mensajes)) {
            return res.status(400).json({
                success: false,
                error: 'Datos inválidos'
            });
        }
        
        // Guardar en memoria
        storage.setMensajesGuardados(mensajes);
        
        // Intentar guardar también al archivo
        try {
            const filePath = path.join(__dirname, '../../mensajes/mensajes-data.js');
            const content = `// Array con mensajes especiales\nconst MENSAJES = ${JSON.stringify(mensajes, null, 2)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = { mensajes: MENSAJES, MENSAJES };\n}`;
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('✅ Mensajes guardados también al archivo');
        } catch (fileError) {
            console.log('⚠️ No se pudo guardar al archivo (normal en Vercel), guardados en memoria:', fileError.message);
        }
        
        res.status(200).json({
            success: true,
            message: 'Mensajes guardados',
            total: mensajes.length,
            count: mensajes.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

