try {
    const mensajesModule = require('../../mensajes/mensajes-data.js');
    module.exports = (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({
            success: true,
            mensajes: mensajesModule.mensajes || [],
            count: (mensajesModule.mensajes || []).length
        });
    };
} catch (error) {
    module.exports = (req, res) => {
        res.status(500).json({
            success: false,
            error: error.message,
            mensajes: [],
            count: 0
        });
    };
}
