module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    try {
        // Intentar cargar desde el archivo
        let poemas = [];
        try {
            const data = require('../../poemas/poemas-data.js');
            poemas = data.poemas || data.POEMAS || [];
        } catch (e) {
            console.log('Error cargando datos:', e.message);
        }
        
        res.status(200).json({
            success: true,
            poemas: poemas,
            count: poemas.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            poemas: [],
            count: 0
        });
    }
};
