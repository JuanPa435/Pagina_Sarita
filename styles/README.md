# 🎨 Estilos CSS

Esta carpeta contiene todos los archivos CSS del proyecto, organizados por sección.

## Archivos Principales

### Página Principal
- `styles-index.css` - Estilos del index.html (navbar, hero, secciones)

### Secciones
- `styles-poemas.css` - Estilos de la página de poemas
- `styles-canciones.css` - Estilos de la página de canciones
- `styles-mensajes.css` - Estilos de la página de mensajes
- `styles-galeria.css` - Estilos de la página de galería

### Modales
- `styles-modal-poemas.css` - Modal de agregar/editar poema
- `styles-modal-canciones.css` - Modal de agregar/editar canción
- `styles-modal-mensajes.css` - Modal de agregar/editar mensaje
- `styles-modal-galeria.css` - Modal de vista de imagen
- `styles-modal-upload.css` - Modal de subir archivo

## Paleta de Colores

```css
:root {
  --primary: #05bfdb;      /* Turquesa */
  --secondary: #0891b2;    /* Cyan oscuro */
  --accent: #ff6b91;       /* Rosa/Coral */
  --dark: #0f2a38;         /* Azul oscuro */
  --light: #f0f9ff;        /* Celeste claro */
  --text: #1e293b;         /* Texto principal */
}
```

## Responsive Design

Breakpoints utilizados:
- `480px` - Móviles pequeños
- `768px` - Tablets
- `1024px` - Desktop

## Convenciones

- Usar clases descriptivas (`.poema-card`, `.cancion-item`)
- Prefijos para componentes específicos (`.btn-`, `.modal-`, `.nav-`)
- Animaciones suaves con `transition` o `@keyframes`
