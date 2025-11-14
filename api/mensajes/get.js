module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    try {
        // Intentar cargar desde el archivo
        let mensajes = [];
        try {
            const data = require('../../mensajes/mensajes-data.js');
            mensajes = data.mensajes || data.MENSAJES || [];
        } catch (e) {
            console.log('Error cargando datos:', e.message);
        }
        
        res.status(200).json({
            success: true,
            mensajes: mensajes,
            count: mensajes.length
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
