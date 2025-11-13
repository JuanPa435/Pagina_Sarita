const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.json());

// Guardar poemas
app.post('/api/poemas/save', (req, res) => {
    const { poemas } = req.body;
    const filePath = path.join(__dirname, '../poemas/poemas-data.js');
    
    const content = `const POEMAS = ${JSON.stringify(poemas, null, 2)};`;
    
    fs.writeFileSync(filePath, content, 'utf8');
    res.json({ success: true, message: 'Poemas guardados correctamente' });
});

// Guardar canciones
app.post('/api/canciones/save', (req, res) => {
    const { canciones } = req.body;
    const filePath = path.join(__dirname, '../canciones/canciones-data.js');
    
    const content = `const CANCIONES = ${JSON.stringify(canciones, null, 2)};`;
    
    fs.writeFileSync(filePath, content, 'utf8');
    res.json({ success: true, message: 'Canciones guardadas correctamente' });
});

// Guardar mensajes
app.post('/api/mensajes/save', (req, res) => {
    const { mensajes } = req.body;
    const filePath = path.join(__dirname, '../mensajes/mensajes-data.js');
    
    const content = `const MENSAJES = ${JSON.stringify(mensajes, null, 2)};`;
    
    fs.writeFileSync(filePath, content, 'utf8');
    res.json({ success: true, message: 'Mensajes guardados correctamente' });
});

// Guardar galería
app.post('/api/galeria/save', (req, res) => {
    const { fotos } = req.body;
    const filePath = path.join(__dirname, '../galeria/galeria-data.js');
    
    const content = `const GALERIA = ${JSON.stringify(fotos, null, 2)};`;
    
    fs.writeFileSync(filePath, content, 'utf8');
    res.json({ success: true, message: 'Fotos guardadas correctamente' });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor de datos ejecutándose en puerto ${PORT}`);
});
