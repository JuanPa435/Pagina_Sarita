try {
    const cancionesModule = require('../../canciones/canciones-data.js');
    module.exports = (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({
            success: true,
            canciones: cancionesModule.canciones || [],
            count: (cancionesModule.canciones || []).length
        });
    };
} catch (error) {
    module.exports = (req, res) => {
        res.status(500).json({
            success: false,
            error: error.message,
            canciones: [],
            count: 0
        });
    };
}
