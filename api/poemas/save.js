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
        const { poemas } = req.body;
        if (!poemas || !Array.isArray(poemas)) {
            return res.status(400).json({
                success: false,
                error: 'Datos inválidos'
            });
        }
        
        storage.setPoemasGuardados(poemas);
        
        res.status(200).json({
            success: true,
            message: 'Poemas guardados en memoria',
            count: poemas.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
