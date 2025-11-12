const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const app = express();

// Configurar middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.static('.'));

// Crear carpetas si no existen
const fotosDir = path.join(__dirname, 'fotos');
const subiradasDir = path.join(fotosDir, 'subidas');
const metadataDir = path.join(__dirname, 'fotos-metadata');

[fotosDir, subiradasDir, metadataDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Endpoint para subir fotos
app.post('/api/upload-foto', async (req, res) => {
    try {
        const { codigo, descripcion, imageData, filename } = req.body;

        // Validar código
        if (codigo !== '0605') {
            return res.status(401).json({ error: 'Código incorrecto' });
        }

        if (!imageData || !filename) {
            return res.status(400).json({ error: 'Faltan datos' });
        }

        // Generar nombre único con timestamp
        const timestamp = Date.now();
        const fileExtension = path.extname(filename);
        const baseName = path.basename(filename, fileExtension);
        const newFileName = `${baseName}_${timestamp}${fileExtension}`;
        const filePath = path.join(subiradasDir, newFileName);

        // Convertir base64 a buffer y guardar
        const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
        
        // Optimizar imagen (reducir tamaño si es necesario)
        const optimizedBuffer = await sharp(imageBuffer)
            .resize(1920, 1920, { 
                fit: 'inside', 
                withoutEnlargement: true 
            })
            .jpeg({ quality: 80 })
            .toBuffer();

        fs.writeFileSync(filePath, optimizedBuffer);

        // Guardar metadata
        const metadata = {
            filename: newFileName,
            descripcion: descripcion || 'Sin descripción',
            fechaSubida: new Date().toISOString(),
            tamaño: optimizedBuffer.length,
            originalFilename: filename
        };

        const metadataPath = path.join(metadataDir, `${newFileName}.json`);
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        res.json({ 
            success: true, 
            mensaje: 'Foto subida correctamente',
            archivo: newFileName,
            ruta: `/fotos/subidas/${newFileName}`
        });

    } catch (error) {
        console.error('Error subiendo foto:', error);
        res.status(500).json({ error: 'Error al subir la foto: ' + error.message });
    }
});

// Endpoint para obtener lista de fotos subidas
app.get('/api/fotos-subidas', (req, res) => {
    try {
        const fotos = fs.readdirSync(subiradasDir)
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
            .map(file => {
                const metadataPath = path.join(metadataDir, `${file}.json`);
                let metadata = {};
                
                if (fs.existsSync(metadataPath)) {
                    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                }
                
                return {
                    archivo: file,
                    ruta: `/fotos/subidas/${file}`,
                    ...metadata
                };
            })
            .sort((a, b) => new Date(b.fechaSubida) - new Date(a.fechaSubida));

        res.json({ fotos });
    } catch (error) {
        console.error('Error obteniendo fotos:', error);
        res.status(500).json({ error: 'Error al obtener fotos' });
    }
});

// Endpoint para eliminar una foto
app.delete('/api/foto/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(subiradasDir, filename);
        const metadataPath = path.join(metadataDir, `${filename}.json`);

        // Validar que el archivo esté en la carpeta permitida
        if (!filePath.startsWith(subiradasDir)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        if (fs.existsSync(metadataPath)) {
            fs.unlinkSync(metadataPath);
        }

        res.json({ success: true, mensaje: 'Foto eliminada' });
    } catch (error) {
        console.error('Error eliminando foto:', error);
        res.status(500).json({ error: 'Error al eliminar foto' });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n✅ Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📸 Fotos subidas se guardan en: ${subiradasDir}`);
    console.log(`📋 Metadata guardada en: ${metadataDir}\n`);
});
