const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    try {
        // Leer directamente del archivo
        const filePath = path.join(__dirname, '../../poemas/poemas-data.js');
        
        // Eliminar la cache del require para obtener los datos más recientes
        delete require.cache[require.resolve(filePath)];
        
        const data = require(filePath);
        const poemas = data.poemas || data.POEMAS || [];
        
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
