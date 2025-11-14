module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    try {
        // Intentar cargar desde el archivo
        let canciones = [];
        try {
            const data = require('../../canciones/canciones-data.js');
            canciones = data.canciones || data.CANCIONES || [];
        } catch (e) {
            console.log('Error cargando datos:', e.message);
        }
        
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
