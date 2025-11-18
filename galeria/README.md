# 📸 Sección de Galería

Esta carpeta contiene todos los archivos relacionados con la sección de galería de fotos.

## Archivos

- `galeria.html` - Página principal de galería

## Funcionalidades

- ✅ Mostrar grid de fotos
- ✅ Subir nuevas fotos
- ✅ Agregar título y descripción
- ✅ Eliminar fotos
- ✅ Vista modal de imagen completa
- ✅ Almacenamiento en PostgreSQL

## Campos de una Foto

```javascript
{
  titulo: "Título de la foto",
  descripcion: "Descripción del momento",
  url: "URL de la imagen"
}
```

## Estilos

- `../styles/styles-galeria.css` - Estilos de la página
- `../styles/styles-modal-galeria.css` - Estilos del modal

## Almacenamiento

Las imágenes se pueden almacenar:
1. Como URLs externas (recomendado)
2. En la carpeta `/uploads/` (local)
3. En servicios de cloud storage (Cloudinary, S3, etc.)
