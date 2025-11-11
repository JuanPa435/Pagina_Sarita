# 💕 Página Para Sarita

Una página web especial y hermosa dedicada a tu novia, con **100 poemas**, **100 canciones**, galería de fotos y mensajes de amor, cada uno en su propia página.

## 🌟 Características

- ✨ **Diseño hermoso y moderno** con gradientes y animaciones
- 📱 **Responsive** - Se ve bien en celulares, tablets y computadoras
- � **Múltiples páginas** - Cada sección tiene su propia página
- 💬 **100+ Poemas** - Poemas dedicados exclusivamente para ti
- 🎵 **100+ Canciones** - Canciones para dedicarte
- 🖼️ **Galería** - Espacio para fotos de ustedes
- 💕 **Mensajes especiales** - Frases románticas
- 🎨 **Tema de colores romántico** en tonos rosa y rojo
- ⚡ **Interactividad** con animaciones suaves
- 📑 **Paginación** - Navegación fácil entre contenido

## 📁 Estructura de archivos

```
Pagina_Sarita/
├── index.html              # Página de inicio (hub central)
├── poemas.html             # Página con 100 poemas
├── poemas-data.js          # Datos de los 100 poemas
├── canciones.html          # Página con 100 canciones
├── canciones-data.js       # Datos de las 100 canciones
├── galeria.html            # Página de galería
├── galeria-data.js         # Datos de fotos
├── mensajes.html           # Página de mensajes
├── mensajes-data.js        # Datos de mensajes
├── styles.css              # Estilos compartidos
├── script.js               # JavaScript compartido
└── README.md               # Este archivo
```

## 🚀 Cómo usar

### Opción 1: Abrir directamente
Solo abre el archivo `index.html` en tu navegador.

### Opción 2: Usar un servidor local
Si prefieres una mejor experiencia, puedes usar un servidor local:

```bash
# Con Python 3
python -m http.server 8000

# O con Node.js
npx http-server
```

Luego abre en tu navegador: `http://localhost:8000`

## ✏️ Cómo personalizar

### Cambiar el nombre
En cada HTML, busca "Sarita" y reemplázalo:
```html
<a href="index.html" class="logo">💕 Tu Nombre Aquí</a>
```

### Agregar/Editar Poemas
Abre `poemas-data.js` y agrega poemas al array `POEMAS`:
```javascript
{ titulo: "Tu título", contenido: "Tu poema aquí<br>con saltos de línea<br>usando <br>" }
```

### Agregar/Editar Canciones
Abre `canciones-data.js` y agrega canciones al array `CANCIONES`:
```javascript
{ 
    titulo: "Nombre de la canción", 
    artista: "Artista",
    razon: "Por qué te la dedico",
    link: "https://spotify.com/..." 
}
```

### Personalizar Galería
Abre `galeria-data.js` y reemplaza las descripciones en el array `GALERIA`.
Las fotos se pueden cambiar reemplazando los divs `.galeria-placeholder` con etiquetas `<img>`:

```html
<img src="ruta/a/tu/foto.jpg" alt="Descripción">
```

### Editar Mensajes
Abre `mensajes-data.js` y personaliza el array `MENSAJES`:
```javascript
{ emoji: "❤️", texto: "Tu mensaje aquí" }
```

### Personalizar Colores
En `styles.css`, modifica las variables de color en `:root`:
```css
:root {
    --color-primary: #ff6b9d;      /* Rosa principal */
    --color-secondary: #c44569;    /* Rosa oscuro */
    --color-accent: #ffd700;       /* Dorado */
    --color-dark: #2d3436;         /* Texto oscuro */
    --color-light: #f5f3ff;        /* Fondo claro */
    --color-white: #ffffff;        /* Blanco */
}
```

## 📝 Paginación

Cada página automáticamente pagina el contenido:
- **Poemas**: 5 poemas por página (20 páginas)
- **Canciones**: 5 canciones por página (20 páginas)
- **Galería**: 8 fotos por página
- **Mensajes**: 6 mensajes por página

Puedes ajustar estos números modificando `POEMAS_POR_PAGINA`, `CANCIONES_POR_PAGINA`, etc. en cada HTML.

## 🎨 Emojis útiles

Usa estos emojis para decorar:
- ❤️ Corazón rojo
- 💕 Dos corazones
- 💖 Corazón con brillo
- 🌹 Rosa roja
- ✨ Estrellas
- 🎵 Nota musical
- 😊 Cara sonriente
- 💫 Destello
- 💝 Caja de regalo
- 🎀 Moño

## 💡 Tips de personalización

1. **Mantén la sinceridad**: Los mejores mensajes vienen del corazón
2. **Agrega detalles personales**: Incluye momentos especiales que compartieron
3. **Usa fotos significativas**: Elige fotos de momentos importantes
4. **Actualiza regularmente**: Agrega nuevo contenido con el tiempo
5. **Cuida la ortografía**: Revisa bien antes de finalizar
6. **Añade más poemas/canciones**: El archivo ya soporta 100+

## 🌐 Cómo compartir la página

### Opción 1: Archivo local
Comparte la carpeta completa con tu novia.

### Opción 2: GitHub Pages (Gratis)
1. Crea una cuenta en [GitHub](https://github.com)
2. Crea un repositorio llamado `tu-usuario.github.io`
3. Sube los archivos
4. Accede desde: `https://tu-usuario.github.io`

### Opción 3: Netlify (Gratis y muy fácil)
1. Sube la carpeta a [Netlify](https://www.netlify.com/)
2. Obtén un dominio automático
3. ¡Listo! Comparte el link

### Opción 4: Vercel (Gratis y rápido)
1. Usa [Vercel](https://vercel.com/)
2. Conecta tu repositorio
3. Deploy automático

## 📝 Licencia

Libre de usar y modificar. ¡Hecha con ❤️ para ti!

---

**Notas:**
- La página es totalmente privada si la mantienes en tu computadora
- Puedes usarla sin conexión a internet
- Todos los cambios se hacen editando los archivos HTML, CSS y JS
- No necesitas conocimientos avanzados de programación
- Los datos se cargan dinámicamente desde los archivos `.js`

¡Que disfrutes creando algo hermoso y especial para tu novia! 💕✨

## 🚀 Cómo usar

### Opción 1: Abrir directamente
Solo abre el archivo `index.html` en tu navegador.

### Opción 2: Usar un servidor local
Si prefieres una mejor experiencia, puedes usar un servidor local:

```bash
# Con Python 3
python -m http.server 8000

# O con Node.js
npx http-server
```

Luego abre en tu navegador: `http://localhost:8000`

## ✏️ Cómo personalizar

### Cambiar el nombre
En `index.html`, busca "Sarita" y reemplázalo por el nombre de tu novia:
```html
<div class="logo">💕 Tu Nombre Aquí</div>
```

### Agregar tus poemas
Encuentra la sección de Poemas en `index.html` y reemplaza los poemas de ejemplo:
```html
<div class="poema-card">
    <h3>Tu título del poema</h3>
    <div class="poema-contenido">
        <p>Tu poema aquí...</p>
    </div>
    <span class="fecha">Fecha o dedicatoria</span>
</div>
```

### Agregar canciones dedicadas
En la sección de Canciones, reemplaza la información:
```html
<div class="cancion-card">
    <div class="cancion-header">
        <h3>🎵 Nombre de la canción</h3>
        <p class="artista">Artista: Nombre del artista</p>
    </div>
    <div class="cancion-razon">
        <p><strong>Por qué te la dedico:</strong> Tu razón aquí...</p>
    </div>
    <button class="btn-secondary" onclick="window.open('link-spotify-o-youtube')">
        Escuchar 🎧
    </button>
</div>
```

### Agregar fotos a la galería
Reemplaza los placeholders con tus fotos. En `index.html`, busca:
```html
<div class="galeria-placeholder">
    <span>Foto 1</span>
</div>
```

Y cámbialo a:
```html
<img src="ruta/a/tu/foto.jpg" alt="Descripción de la foto">
```

Asegúrate de que tus fotos estén en la carpeta del proyecto.

### Cambiar mensajes especiales
En la sección de Mensajes, edita o agrega nuevos:
```html
<div class="mensaje-box">
    <div class="mensaje-emoji">❤️</div>
    <p class="mensaje-texto">"Tu mensaje aquí"</p>
</div>
```

### Personalizar colores
En `styles.css`, modifica las variables de color:
```css
:root {
    --color-primary: #ff6b9d;      /* Rosa principal */
    --color-secondary: #c44569;    /* Rosa oscuro */
    --color-accent: #ffd700;       /* Dorado */
    --color-dark: #2d3436;         /* Texto oscuro */
    --color-light: #f5f3ff;        /* Fondo claro */
    --color-white: #ffffff;        /* Blanco */
}
```

## 🎨 Emojis útiles

Usa estos emojis para decorar tu página:
- ❤️ Corazón rojo
- 💕 Dos corazones
- 💖 Corazón con brillo
- 🌹 Rosa roja
- ✨ Estrellas
- 🎵 Nota musical
- 😊 Cara sonriente
- 💫 Destello
- 💝 Caja de regalo
- 🎀 Moño
- 🌹 Flor

## 💡 Tips de personalización

1. **Mantén la sinceridad**: Los mejores poemas y mensajes son aquellos que vienen del corazón
2. **Agrega detalles personales**: Incluye referencias a momentos especiales que compartieron
3. **Usa fotos significativas**: Elige fotos que representen momentos importantes juntos
4. **Actualiza regularmente**: Agrega nuevos poemas, canciones y mensajes conforme pase el tiempo
5. **Cuida la ortografía**: Revisa bien antes de publicar

## 🌐 Cómo compartir la página

### Opción 1: Archivo local
Simplemente comparte el archivo `index.html` o la carpeta completa.

### Opción 2: Subir a GitHub Pages (Gratis)
1. Crea una cuenta en [GitHub](https://github.com)
2. Crea un repositorio llamado `tu-usuario.github.io`
3. Sube los archivos
4. Accede desde: `https://tu-usuario.github.io`

### Opción 3: Usar un servicio de hosting
- [Netlify](https://www.netlify.com/) - Gratis y muy fácil
- [Vercel](https://vercel.com/) - Gratis y rápido
- [GitHub Pages](https://pages.github.com/) - Gratis con GitHub

## 📝 Licencia

Libre de usar y modificar. ¡Hecha con ❤️ para ti!

---

**Notas:**
- La página es totalmente privada si la mantienes en tu computadora
- Puedes descargarla y usarla sin conexión a internet
- Todos los cambios se hacen editando los archivos HTML, CSS y JS

¡Que disfrutes creando algo especial para tu novia! 💕✨