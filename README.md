# Pagina Sarita 💙

Página web romántica con backend Flask y MySQL.

## 🚀 Desarrollo

Ejecuta backend (Flask) y frontend (servidor estático) simultáneamente:

```bash
npm run dev
```

Esto inicia:
- Backend: http://127.0.0.1:5050
- Frontend: http://127.0.0.1:8080

### URLs de desarrollo

- **Inicio**: http://127.0.0.1:8080/index.html
- **Poemas**: http://127.0.0.1:8080/paginas/poemas/poemas.html
- **Canciones**: http://127.0.0.1:8080/paginas/canciones/canciones.html
- **Recuerdos**: http://127.0.0.1:8080/paginas/galeria/galeria.html
- **Meses**: http://127.0.0.1:8080/paginas/meses/meses.html

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/poemas/get` - Obtener poemas
- `POST /api/poemas/save` - Guardar poemas
- `GET /api/canciones/get` - Obtener canciones
- `POST /api/canciones/save` - Guardar canciones
- `GET /api/recuerdos/get` - Obtener recuerdos
- `POST /api/recuerdos/upload` - Subir recuerdo
- `GET /api/recuerdos/imagen/<id>` - Obtener imagen
- `GET /api/meses/get` - Obtener meses
- `POST /api/meses/save` - Guardar meses

## 🏭 Producción

### Configuración de Vercel

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Configura la variable de entorno `DATABASE_URL` en Vercel:
```bash
vercel env add DATABASE_URL
```
Pega tu MySQL URL: `mysql://root:...@shinkansen.proxy.rlwy.net:27654/railway`

3. Deploy:
```bash
vercel --prod
```

### Producción local con gunicorn

```bash
npm run prod
# o
bash scripts/prod.sh
```

Variables de entorno opcionales:
- `PORT` - Puerto del backend (default: 5050)
- `WORKERS` - Número de workers de gunicorn (default: 4)
- `TIMEOUT` - Timeout en segundos (default: 120)
- `DATABASE_URL` - URL de MySQL (default: la hardcodeada en conexion/db.py)

Ejemplo:
```bash
PORT=8000 WORKERS=2 DATABASE_URL="mysql://..." npm run prod
```

## 📦 Estructura

```
├── backend/
│   ├── app.py              # Flask app principal
│   └── requirements.txt    # Dependencias Python
├── conexion/
│   ├── db.py              # Conexión MySQL centralizada
│   └── vercel_handler.py  # Handler para Vercel
├── paginas/
│   ├── poemas/
│   ├── canciones/
│   ├── galeria/
│   ├── meses/
│   └── styles/
├── scripts/
│   ├── dev.sh             # Script de desarrollo
│   └── prod.sh            # Script de producción
├── config.js              # Configuración del frontend
├── index.html             # Página principal
├── package.json           # Scripts npm
└── vercel.json            # Configuración Vercel
```

## 🛠 Dependencias

### Backend (Python)
- Flask 3.0.0
- flask-cors 4.0.0
- mysql-connector-python 8.2.0
- gunicorn 21.2.0

### Instalación
```bash
cd backend
pip install -r requirements.txt
```

## 🗄 Base de Datos

MySQL en Railway:
- Host: shinkansen.proxy.rlwy.net:27654
- Database: railway

Tablas:
- `poemas` - Poemas guardados
- `canciones` - Canciones dedicadas
- `galeria` - Fotos con descripción
- `meses` - Celebraciones mensuales

## 📝 Notas

- El frontend detecta automáticamente el entorno (dev/prod) y ajusta las URLs del backend.
- En desarrollo usa `http://127.0.0.1:5050/api`
- En producción usa `/api` (rutas relativas)
- Override manual: `localStorage.setItem('FORCE_BACKEND_URL', 'http://...')` en la consola del navegador.
