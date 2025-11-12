# 🚀 Instalación del Backend para Subida de Fotos

## ¿Qué es esto?

Este backend permite que las fotos subidas en la galería se guarden **automáticamente** en la carpeta `/fotos/subidas/` del proyecto, en lugar de solo guardarlas en localStorage.

## Requisitos

- **Node.js** (versión 12 o superior) - [Descargar aquí](https://nodejs.org/)

## Instalación

### Paso 1: Instalar dependencias

```bash
npm install
```

Esto instalará:
- **express**: Servidor web
- **multer**: Manejo de archivos
- **sharp**: Optimización de imágenes

### Paso 2: Iniciar el servidor

```bash
npm start
```

O simplemente:

```bash
node server.js
```

Deberías ver algo como:
```
✅ Servidor ejecutándose en http://localhost:3000
📸 Fotos subidas se guardan en: ./fotos/subidas/
📋 Metadata guardada en: ./fotos-metadata/
```

## Uso

1. **Abre el navegador** en `http://localhost:3000`
2. **Ve a la galería**
3. **Haz clic en "+ Agregar"**
4. **Ingresa el código:** `0605`
5. **Selecciona fotos** (pueden ser grandes, hasta 10MB)
6. **Haz clic en "✅ Subir Fotos"**
7. **Las fotos se guardarán automáticamente** en `/fotos/subidas/`

## Estructura de carpetas

```
Pagina_Sarita/
├── fotos/
│   ├── foto 1.jpg (fotos originales)
│   ├── foto 2.jpg
│   └── subidas/          ← Las nuevas fotos van aquí
│       ├── miafoto_1699234567890.jpg
│       ├── otrafoto_1699234890123.jpg
│       └── ...
├── fotos-metadata/       ← Información de las fotos
│   ├── miafoto_1699234567890.jpg.json
│   ├── otrafoto_1699234890123.jpg.json
│   └── ...
└── server.js
```

## Metadata de fotos

Cada foto subida genera automáticamente un archivo JSON con información:

```json
{
  "filename": "miafoto_1699234567890.jpg",
  "descripcion": "En la playa",
  "fechaSubida": "2025-11-12T10:30:45.123Z",
  "tamaño": 245678,
  "originalFilename": "miafoto.jpg"
}
```

## API REST

### Subir una foto
```
POST /api/upload-foto
Content-Type: application/json

{
  "codigo": "0605",
  "descripcion": "Descripción opcional",
  "imageData": "data:image/jpeg;base64,...",
  "filename": "mifoto.jpg"
}
```

### Obtener lista de fotos subidas
```
GET /api/fotos-subidas
```

Respuesta:
```json
{
  "fotos": [
    {
      "archivo": "miafoto_1699234567890.jpg",
      "ruta": "/fotos/subidas/miafoto_1699234567890.jpg",
      "descripcion": "En la playa",
      "fechaSubida": "2025-11-12T10:30:45.123Z"
    }
  ]
}
```

### Eliminar una foto
```
DELETE /api/foto/miafoto_1699234567890.jpg
```

## Características

✅ **Optimización automática** - Las imágenes se comprimen para ahorrar espacio
✅ **Metadata** - Cada foto guarda descripción, fecha y tamaño
✅ **Código de seguridad** - Solo usuarios con código 0605 pueden subir
✅ **Respaldo en localStorage** - Las fotos también se guardan localmente
✅ **Nombres únicos** - Cada foto tiene un timestamp para evitar conflictos

## Solución de problemas

### "npm: comando no encontrado"
Necesitas instalar Node.js. Descárgalo desde https://nodejs.org/

### "EADDRINUSE: address already in use"
El puerto 3000 está en uso. Para usar otro puerto:
```bash
PORT=4000 npm start
```

### "Error: Cannot find module 'express'"
Ejecuta:
```bash
npm install
```

## Próximos pasos

- Subir fotos con el código 0605
- Las fotos se guardarán en `/fotos/subidas/`
- Hacer commit a GitHub para persistencia
- ¡Compartir la página! 💕

---

Hecho con ❤️ para Sarita
