# 📝 Sección de Poemas

Esta carpeta contiene todos los archivos relacionados con la sección de poemas.

## Archivos

- `poemas.html` - Página principal de poemas
- `poemas-data.js` - Datos de respaldo (legacy)
- `poemas-data.backup.*.js` - Backups automáticos

## Funcionalidades

- ✅ Mostrar lista de poemas con paginación
- ✅ Agregar nuevos poemas
- ✅ Editar poemas existentes
- ✅ Eliminar poemas
- ✅ Buscar por título, contenido o autor
- ✅ Almacenamiento en PostgreSQL

## Campos de un Poema

```javascript
{
  titulo: "Título del poema",
  contenido: "Texto del poema (con saltos de línea)",
  autor: "Autor o dedicatoria"
}
```

## Estilos

- `../styles/styles-poemas.css` - Estilos de la página
- `../styles/styles-modal-poemas.css` - Estilos del modal
