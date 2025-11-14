const storage = require('../storage.js');

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    try {
        const canciones = storage.cancionesGuardadas || [];
        res.status(200).json({
            success: true,
            canciones: canciones,
            count: canciones.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            canciones: [],
            count: 0
        });
    }
};
