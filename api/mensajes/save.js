const storage = require('../storage.js');

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
        
        storage.setMensajesGuardados(mensajes);
        
        res.status(200).json({
            success: true,
            message: 'Mensajes guardados en memoria',
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

