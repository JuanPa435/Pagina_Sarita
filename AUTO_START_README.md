# 🎵 Pagina Sarita - Sistema de Poemas y Canciones

Sistema completo de gestión de poemas y canciones románticas con backend persistente.

## 🚀 Inicio Rápido

### En Codespaces (Recomendado)
El backend se inicia **automáticamente** al abrir el Codespace gracias a la configuración en `.devcontainer/devcontainer.json`.

Solo accede a:
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000

### En tu computadora local

#### Opción 1: Iniciar todo automáticamente
```bash
bash start-all.sh
```

#### Opción 2: Iniciar por separado

**Terminal 1 - Backend:**
```bash
npm start
# o
node backend/save-data.js
```

**Terminal 2 - Frontend:**
```bash
python3 -m http.server 8080
```

Luego accede a `http://localhost:8080`

## 📁 Estructura del Proyecto

```
/
├── backend/
│   └── save-data.js          # Server Express (puerto 3000)
├── poemas/
│   ├── poemas.html           # UI de poemas
│   └── poemas-data.js        # Datos persistentes
├── canciones/
│   ├── canciones.html        # UI de canciones
│   └── canciones-data.js     # Datos persistentes
├── styles/
│   ├── styles-poemas.css
│   ├── styles-canciones-turquesa.css
│   └── ...
├── .devcontainer/
│   └── devcontainer.json     # Config para Codespaces (auto-inicia backend)
├── start-all.sh              # Script para iniciar todo
├── package.json              # Dependencias Node.js
└── index.html                # Página principal
```

## 🔧 Configuración de Codespaces

El archivo `.devcontainer/devcontainer.json` está configurado para:
- ✅ Instalar Node.js automáticamente
- ✅ Instalar dependencias npm (`npm install`)
- ✅ **Iniciar backend automáticamente** (`node backend/save-data.js`)
- ✅ Exponer puertos 3000 y 8080 automáticamente

Esto significa que cuando abras el Codespace:
1. El backend se inicia en `http://localhost:3000`
2. El frontend está disponible en `http://localhost:8080`
3. Los datos se persisten automáticamente
4. **Los visitantes de tu enlace compartido verán todo sin problemas**

## 📚 API Endpoints

### Poemas
- `GET /api/poemas/get` - Obtiene todos los poemas
- `POST /api/poemas/save` - Guarda/actualiza poemas

### Canciones
- `GET /api/canciones/get` - Obtiene todas las canciones
- `POST /api/canciones/save` - Guarda/actualiza canciones

## 🎨 Características

✅ Interfaz moderna con gradientes turquesa-morado-rosa  
✅ Glassmorphism (efecto de vidrio)  
✅ Búsqueda y filtros en tiempo real  
✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)  
✅ Persistencia en backend  
✅ Botón "Escuchar" con link a Spotify  
✅ Modal para editar/agregar items  
✅ Responsive design  

## 🐛 Troubleshooting

### "No se ve nada cuando abro el link"
✅ **Solucionado:** El backend ahora se inicia automáticamente en Codespaces

### "El puerto 3000/8080 ya está en uso"
```bash
# Encontrar el proceso que lo está usando
lsof -i :3000
lsof -i :8080

# Matarlo
kill -9 <PID>
```

### "Ver logs del backend"
```bash
tail -f /tmp/backend.log
```

## 📝 Notas

- Los datos se guardan en archivos JSON (`poemas-data.js`, `canciones-data.js`)
- El backend mantiene los datos en memoria y los persiste en el archivo system
- CORS está habilitado para requests desde el frontend
- Todo funciona sin base de datos externa

---

**Made with ❤️ for Sarita**
