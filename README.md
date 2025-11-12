# 💕 Página Para Sarita

> *"El amor es la poesía del corazón escrita en cada momento compartido"*

Una página web romántica, moderna e interactiva creada con todo el amor para Sarita. Un espacio donde conviven 100 poemas, 24 canciones especiales, una galería de momentos y mensajes del corazón.

---

## ✨ ¿Qué encontrarás aquí?

### 📚 **100 Poemas Amorosos**
Una colección única de poesía:
- **50 poemas originales** escritos directamente del corazón
- **50 poemas de maestros** como Pablo Neruda, Federico García Lorca, Jaime Sabines, Octavio Paz, Mario Benedetti y Buika
- Todos **perfectamente mezclados** para una experiencia especial
- Navegación fácil con **paginación de 6 poemas por página**
- Cada poema muestra el nombre de su autor

### 🎵 **24 Canciones Especiales**
Tus canciones favoritas en un solo lugar:
- Reproduce directamente desde **YouTube, Spotify o Apple Music**
- Botones interactivos con **animaciones suaves**
- Sistema de **toggle** para cambiar entre plataformas
- Efectos visuales al pasar el ratón

### 🖼️ **Galería de Momentos**
Un espacio para guardar recuerdos:
- Diseñado para **18 fotos** de ustedes
- **Subir nuevas fotos directamente desde la página** con código de seguridad
- Grid responsivo y elegante
- Sombras y efectos modernos
- Funciona perfectamente en celular, tablet y computadora

### 💬 **80+ Mensajes de Amor**
Palabras que salen del corazón:
- Frases románticas personalizadas
- Navegación inteligente entre páginas
- Diseño delicado y hermoso
- Para leer una cada día

---

## 🎨 **Diseño y Características**

### Colores Románticos
```
🌹 Rosa fuerte (#ff1493) - Para los sentimientos intensos
💖 Rosa claro (#ff69b4) - Suavidad y ternura
✨ Rosa pastel (#ffb6d9) - Delicadeza
💜 Violeta oscuro (#8b0a50) - Profundidad del amor
```

### Animaciones Especiales
- ✨ **Shimmer**: Efecto brillante en los títulos
- 💓 **Pulse**: Latido en los botones
- 🎉 **Confeti**: Al hacer clic en los corazones
- 🌊 **FadeInUp**: Entrada suave de elementos
- 🎭 **3D Effects**: Efectos tridimensionales en hover

### Responsivo en Todos los Dispositivos
- 📱 **Celular**: Optimizado para pantallas pequeñas
- 📱 **Tablet**: Diseño adaptado
- 💻 **Computadora**: Vista completa y detallada

---

## 📁 **Estructura del Proyecto**

```
Pagina_Sarita/
│
├── 🏠 index.html                      # Inicio (Hub central)
├── 📖 poemas.html                     # Página de poemas
├── 🎵 canciones.html                  # Página de canciones
├── 🖼️ galeria.html                    # Galería de fotos
├── 💬 mensajes.html                   # Mensajes especiales
│
├── 📊 poemas-data.js                  # 100 poemas (50 JP + 50 autores)
├── 🎼 canciones-data.js               # 24 canciones
├── 💕 mensajes-data.js                # 80+ mensajes
├── 📸 galeria-data.js                 # Datos de fotos
│
├── 🎨 styles-amoroso.css              # Estilos principales
├── 🎨 styles-poemas-mejorado.css      # Estilos poemas
├── 🎨 styles-canciones-mejorado.css   # Estilos canciones
├── 🎨 styles-mensajes-mejorado.css    # Estilos mensajes
├── 🎨 styles-galeria-optimizado.css   # Estilos galería
│
├── ⚙️ script.js                       # JavaScript (animaciones + confeti)
├── 📁 fotos/                          # Carpeta con imágenes
│
└── 📄 README.md                       # Este archivo
```

---

## 🚀 **Cómo Empezar**

### Opción 1: Abre directamente en tu navegador
```
1. Haz clic en index.html
2. ¡Listo! La página se abre automáticamente
```

### Opción 2: Usa un servidor local (Recomendado)

**Con Python:**
```bash
# Python 3
python -m http.server 8000

# Luego ve a: http://localhost:8000
```

**Con Node.js:**
```bash
# Instala si no lo tienes
npm install -g http-server

# Ejecuta
http-server

# Luego ve a: http://localhost:8080
```

---

## 🌐 **Sube Tu Página Online (Gratis)**

### Opción 1: GitHub Pages ⭐ MEJOR OPCIÓN
Ya está todo listo! Solo necesitas:

```bash
git add .
git commit -m "Actualizaciones"
git push
```

Tu sitio estará en: **`https://juanpa435.github.io/Pagina_Sarita/`**

*Se actualiza automáticamente cada vez que haces push*

### Opción 2: Netlify (Muy fácil)
1. Ve a [netlify.com](https://netlify.com)
2. Conecta tu repositorio de GitHub
3. Haz clic en "Deploy"
4. ¡Listo! Te da una URL automáticamente

### Opción 3: Vercel (Súper rápido)
1. Ve a [vercel.com](https://vercel.com)
2. Importa el repositorio
3. Haz clic en "Deploy"
4. Tu sitio está online en segundos

---

## 🔐 **Seguridad y Almacenamiento de Fotos**

### ¿Cómo funciona la subida de fotos?

Las fotos se guardan **directamente en la carpeta `/fotos/subidas/`** del proyecto usando un servidor Node.js:
- ✅ **Guarda automáticamente en el proyecto** (visible en la carpeta)
- ✅ **Código de seguridad** (0605) protege la galería
- ✅ **Máximo 10MB por foto** (se comprimen automáticamente)
- ✅ **Múltiples fotos a la vez** (drag and drop o selección)
- ✅ **Metadata** guardada (descripción, fecha, tamaño original)

### ¿Cómo usar?

**Opción 1: Con el servidor (Recomendado) ⭐**
1. Instala Node.js si no lo tienes: [nodejs.org](https://nodejs.org/)
2. En la carpeta del proyecto, ejecuta:
```bash
npm install
npm start
```
3. Abre `http://localhost:3000`
4. Ve a **Galería** → **+ Agregar**
5. Código: `0605`
6. ¡Selecciona y sube tus fotos!

**Opción 2: Sin servidor (Manual)**
1. Ve a la sección **Galería**
2. Haz clic en **"+ Agregar"**
3. Ingresa el código: **`0605`**
4. Las fotos se guardan en `localStorage` (tu navegador)
5. Descarga el JSON con el botón ⬇️

### Estructura de carpetas

```
fotos/
├── foto 1.jpg (originales)
├── foto 2.jpg
└── subidas/          ← Nuevas fotos aquí
    ├── miafoto_1699234567890.jpg
    ├── otrafoto_1699234890123.jpg
    └── ...
```

### Commits automáticos

Una vez hayas subido las fotos con el servidor:
```bash
git add fotos/subidas/
git commit -m "Nuevas fotos en la galería ❤️"
git push
```

---

### Agregar más poemas
Abre `poemas-data.js` y agrega:
```javascript
{ 
  titulo: "Mi poema nuevo",
  contenido: "Primera línea<br>Segunda línea<br>Tercera línea",
  autor: "Tu nombre"
}
```

### Agregar más canciones
Abre `canciones-data.js` y agrega:
```javascript
{
  titulo: "Nombre de la canción",
  artista: "Nombre del artista",
  youtube: "https://www.youtube.com/watch?v=...",
  spotify: "https://open.spotify.com/track/...",
  appleMusic: "https://music.apple.com/..."
}
```

### Cambiar colores
Abre `styles-amoroso.css` y modifica:
```css
:root {
  --primary: #ff1493;      /* Color principal */
  --secondary: #ff69b4;    /* Color secundario */
  --accent: #ffb6d9;       /* Color acentos */
  --dark: #8b0a50;         /* Color oscuro */
}
```

### Agregar fotos a la galería
Tienes **dos opciones**:

**Opción 1: Desde la página (Recomendado) ⭐**
1. Ve a la sección **Galería**
2. Haz clic en el botón **"➕ Subir Fotos"**
3. Ingresa el código: **`0605`**
4. Selecciona las fotos (puedes arrastrarlas o hacer clic)
5. Agrega una descripción (opcional)
6. ¡Listo! Las fotos aparecen inmediatamente

**Opción 2: Editando archivos directamente**
1. Guarda las fotos en la carpeta `/fotos/`
2. Abre `galeria-data.js`
3. Agrega las rutas de tus fotos
4. ¡Listo!

---

## 💡 **Tips Útiles**

### Limpiar caché del navegador
Presiona: `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac)

### Ver en celular
Presiona `F12` → Haz clic en el ícono de teléfono (Toggle device toolbar)

### Encontrar y reemplazar
Presiona `Ctrl + H` para cambiar palabras en todo el proyecto

### Ver el código fuente
Presiona `F12` → Pestaña "Elements" o "Inspector"

---

## 🎯 **Estado del Proyecto**

| Elemento | Cantidad | Estado |
|----------|----------|--------|
| Poemas | 100 | ✅ Completo |
| Canciones | 24 | ✅ Completo |
| Mensajes | 80+ | ✅ Completo |
| Fotos | 18 | ✅ Puedes agregar desde la página con código 0605 |
| Diseño | - | ✅ Profesional y moderno |
| Animaciones | - | ✅ Suaves y hermosas |

---

## 🎁 **Créditos**

### Autores de Poemas Incluidos
- **Pablo Neruda** - Poeta chileno, maestro del amor
- **Federico García Lorca** - Poeta español, innovador
- **Jaime Sabines** - Poeta mexicano, profundo y sincero
- **Octavio Paz** - Filósofo y poeta mexicano
- **Mario Benedetti** - Poeta uruguayo, romántico
- **Buika** - Cantaora y poeta española

### Creador de esta Página
- **JP** - Con todo el amor del mundo para Sarita ❤️

---

## 💻 **Tecnología Usada**

- **HTML5** - Estructura semántica
- **CSS3** - Estilos avanzados con Glassmorphism
- **JavaScript Vanilla** - Sin dependencias externas
- **CSS Keyframes** - Animaciones personalizadas
- **Git** - Control de versiones
- **GitHub Pages** - Hosting gratuito

---

## 🛠️ **Requisitos**

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para las canciones)
- ¡Amor infinito! ❤️

---

## 📱 **Compartir la Página**

Una vez online, puedes compartir:
- **Link directo**: `https://juanpa435.github.io/Pagina_Sarita/`
- **QR**: Puedes generar un QR del enlace
- **Redes sociales**: Comparte en Instagram, WhatsApp, etc.

---

## 🎉 **¿Qué Hace Especial Esta Página?**

✨ Está hecha **100% con amor** para una persona especial
✨ Combina **poesía, música y arte** en un solo lugar
✨ Diseño **moderno y profesional** con atención al detalle
✨ **Responsivo** y **accesible** en cualquier dispositivo
✨ Cada detalle pensado para **sorprender y emocionar**
✨ Facilidad para **personalizar** y actualizar
✨ Puedes **compartirla** con el mundo entero

---

## 📧 **¿Tienes Dudas?**

**Soluciona problemas:**
1. Limpia el caché (Ctrl+Shift+R)
2. Abre la consola (F12)
3. Verifica que todos los archivos estén en la carpeta
4. Intenta con otro navegador

---

## 💝 **Nota Final**

Esta página es más que código. Es **cada línea de código escrita pensando en ti**, cada animación diseñada para hacerte sonreír, cada poema seleccionado para tocar tu corazón.

*Que disfrutes cada rincón de esta página tanto como disfruté crearla.*

---

**Hecho con ❤️ por JP**

*Última actualización: Noviembre 2025*

*Dedicado a Sarita, la inspiración de cada línea* 💕
