const storage = require('../storage.js');

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    try {
        res.status(200).json({
            success: true,
            mensajes: storage.mensajesGuardados,
            count: storage.mensajesGuardados.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            mensajes: [],
            count: 0
        });
    }
};
