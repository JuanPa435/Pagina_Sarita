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
        const { canciones } = req.body;
        if (!canciones || !Array.isArray(canciones)) {
            return res.status(400).json({
                success: false,
                error: 'Datos inválidos'
            });
        }
        
        storage.setCancionesGuardadas(canciones);
        
        res.status(200).json({
            success: true,
            message: 'Canciones guardadas en memoria',
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
