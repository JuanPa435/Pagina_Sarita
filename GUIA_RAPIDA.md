# 🚀 GUÍA RÁPIDA DE INICIO

## ⚡ Inicio Rápido (5 minutos)

### 1. Iniciar el Backend

```bash
cd backend-python
python3 app.py
```

✅ El servidor estará en `http://127.0.0.1:5000`

### 2. Abrir la Página

Abre `index.html` en tu navegador favorito.

### 3. ¡Listo!

Ya puedes agregar poemas, canciones, mensajes y fotos.

---

## 📁 Estructura del Proyecto

```
Pagina_Sarita/
│
├── 📄 index.html              ← Página principal
├── ⚙️ config.js              ← Configuración del backend
├── 📖 README.md              ← Documentación principal
├── 🚀 GUIA_RAPIDA.md         ← Esta guía
│
├── 📝 poemas/                ← Sección de poemas
│   ├── poemas.html
│   └── README.md
│
├── 🎵 canciones/             ← Sección de canciones
│   ├── canciones.html
│   └── README.md
│
├── 💌 mensajes/              ← Sección de mensajes
│   ├── mensajes.html
│   └── README.md
│
├── 📸 galeria/               ← Sección de fotos
│   ├── galeria.html
│   └── README.md
│
├── 🎨 styles/                ← Estilos CSS
│   ├── styles-index.css
│   ├── styles-poemas.css
│   ├── styles-canciones.css
│   └── README.md
│
├── 🐍 backend-python/        ← Backend Flask
│   ├── app.py
│   ├── migrate.py
│   ├── requirements.txt
│   └── README.md
│
└── 🖼️ assets/                ← Recursos estáticos
    ├── images/
    └── icons/
```

---

## 🛠️ Comandos Útiles

### Backend

```bash
# Iniciar servidor Flask
cd backend-python && python3 app.py

# Verificar salud del backend
curl http://127.0.0.1:5000/health

# Ver poemas en la base de datos
curl http://127.0.0.1:5000/api/poemas/get

# Migrar datos de .js a PostgreSQL
cd backend-python && python3 migrate.py
```

### Git

```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit
git commit -m "Descripción de cambios"

# Push a Railway (auto-deploy)
git push origin main
```

---

## 🎯 Características Principales

### ✅ Poemas
- Agregar, editar, eliminar poemas
- Buscar por título, contenido o autor
- Paginación de 12 por página

### ✅ Canciones
- Agregar canciones con link a Spotify
- **Campo especial:** ¿Quién dedica? (Sarita / JP)
- Filtrar por dedicador
- Badge visual de quien dedica

### ✅ Mensajes
- Mensajes de amor con fecha
- Buscar por asunto o contenido
- Formato de tarjeta romántica

### ✅ Galería
- Subir fotos con título y descripción
- Vista en grid responsive
- Modal para ver imagen completa

### ✅ Responsive
- Diseño adaptable a móviles, tablets y desktop
- Navbar con menú hamburguesa en móvil
- Breakpoints: 480px, 768px, 1024px

---

## 🔧 Solución de Problemas

### ❌ Los poemas no aparecen

1. **Verifica que el backend esté corriendo:**
```bash
curl http://127.0.0.1:5000/health
```

2. **Abre la consola del navegador (F12)** y busca errores

3. **Verifica la configuración:**
```javascript
// En la consola del navegador
console.log(CONFIG.BACKEND_URL);
```

4. **Fuerza recarga sin caché:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### ❌ Error de CORS

Asegúrate de que `flask-cors` esté instalado:
```bash
pip install flask-cors
```

### ❌ Base de datos vacía

Ejecuta el script de migración:
```bash
cd backend-python
python3 migrate.py
```

---

## 📊 Estado Actual de Datos

Ejecuta en la terminal para ver el estado:

```bash
# Contar poemas
curl -s http://127.0.0.1:5000/api/poemas/get | python3 -c "import sys, json; d=json.load(sys.stdin); print(f'{len(d[\"poemas\"])} poemas')"

# Contar canciones
curl -s http://127.0.0.1:5000/api/canciones/get | python3 -c "import sys, json; d=json.load(sys.stdin); print(f'{len(d[\"canciones\"])} canciones')"

# Contar mensajes
curl -s http://127.0.0.1:5000/api/mensajes/get | python3 -c "import sys, json; d=json.load(sys.stdin); print(f'{len(d[\"mensajes\"])} mensajes')"
```

---

## 🌐 Deploy a Railway

### Paso 1: Asegúrate de tener un Procfile

Ya está creado en la raíz:
```
web: cd backend-python && python app.py
```

### Paso 2: Commit y Push

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Paso 3: Railway auto-detecta y deploya

Railway verá el Procfile y ejecutará automáticamente el backend Python.

### Paso 4: Configurar Variables de Entorno

En Railway dashboard:
- `DATABASE_URL` - Ya configurado automáticamente
- `PORT` - Ya configurado automáticamente

---

## 💡 Tips y Trucos

### Cambiar Backend URL manualmente

En la consola del navegador:
```javascript
localStorage.setItem('FORCE_BACKEND_URL', 'http://127.0.0.1:5000/api');
location.reload();
```

Para remover:
```javascript
localStorage.removeItem('FORCE_BACKEND_URL');
location.reload();
```

### Ver logs del backend Flask

Los logs aparecen en la terminal donde ejecutaste `python3 app.py`

### Limpiar cache del navegador

Si ves datos antiguos, limpia el cache:
- Chrome: `Ctrl + Shift + Delete`
- Firefox: `Ctrl + Shift + Delete`

---

## 📞 Ayuda

Si algo no funciona:

1. **Revisa los README.md** de cada carpeta
2. **Consulta backend-python/README.md** para endpoints
3. **Abre la consola del navegador** para ver errores JavaScript
4. **Revisa los logs de Flask** en la terminal

---

Hecho con 💙 para nuestra historia de amor
