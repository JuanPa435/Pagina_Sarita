# 💌 Sección de Mensajes

Esta carpeta contiene todos los archivos relacionados con la sección de mensajes.

## Archivos

- `mensajes.html` - Página principal de mensajes
- `mensajes-data.js` - Datos de respaldo (legacy)

## Funcionalidades

- ✅ Mostrar lista de mensajes con paginación
- ✅ Agregar nuevos mensajes
- ✅ Editar mensajes existentes
- ✅ Eliminar mensajes
- ✅ Buscar por asunto o contenido
- ✅ Fecha de cada mensaje
- ✅ Almacenamiento en PostgreSQL

## Campos de un Mensaje

```javascript
{
  asunto: "Asunto del mensaje",
  contenido: "Texto del mensaje",
  fecha: "2025-11-18" // Formato ISO
}
```

## Estilos

- `../styles/styles-mensajes.css` - Estilos de la página
- `../styles/styles-modal-mensajes.css` - Estilos del modal
