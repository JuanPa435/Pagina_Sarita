# 🎵 Sección de Canciones

Esta carpeta contiene todos los archivos relacionados con la sección de canciones.

## Archivos

- `canciones.html` - Página principal de canciones
- `canciones-data.js` - Datos de respaldo (legacy)
- `canciones-data.backup.*.js` - Backups automáticos

## Funcionalidades

- ✅ Mostrar lista de canciones con paginación
- ✅ Agregar nuevas canciones
- ✅ Editar canciones existentes
- ✅ Eliminar canciones
- ✅ Buscar por título, artista o razón
- ✅ **Campo especial:** ¿Quién dedica? (Sarita / JP)
- ✅ Filtrar por dedicador
- ✅ Badge de dedicador en cada canción
- ✅ Almacenamiento en PostgreSQL

## Campos de una Canción

```javascript
{
  titulo: "Título de la canción",
  artista: "Nombre del artista",
  url: "Link a Spotify/YouTube",
  razon: "Por qué es especial esta canción",
  dedicadoPor: "Sarita" | "JP"  // ⭐ Campo especial
}
```

## Estilos

- `../styles/styles-canciones.css` - Estilos de la página
- `../styles/styles-modal-canciones.css` - Estilos del modal
- Incluye estilos para `.badge-dedicador` y `.radio-pill`
