# 🚀 Guía de Despliegue - Vercel + Railway

## 📋 Resumen

- **Frontend**: Despliega en Vercel (HTML estático)
- **Backend**: Despliega en Railway (Flask + PostgreSQL)
- **Fotos**: Se guardan como **BYTEA en PostgreSQL** (no hay archivos locales)

---

## ✅ Ventajas del nuevo sistema

🔹 **Las fotos persisten en la base de datos**: no se pierden al redesplegar  
🔹 **Sin dependencia del sistema de archivos**: funciona en entornos serverless/containerizados  
🔹 **Migración automática**: el backend detecta y migra la estructura antigua al iniciar

---

## 🛠️ Configuración en Vercel (Frontend)

1. **Conecta tu repo** en Vercel
2. **Framework Preset**: `Other` (HTML estático)
3. **Build Command**: (dejar vacío)
4. **Output Directory**: `.` (raíz del proyecto)
5. **Variables de entorno** (opcional):
   ```
   BACKEND_URL=https://tu-backend-railway.up.railway.app/api
   ```
   *(Pero `config.js` ya detecta automáticamente producción usando rutas relativas `/api`)*

### Vercel Rewrites (vercel.json)

Crea `vercel.json` en la raíz para hacer proxy al backend en Railway:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://tu-backend-railway.up.railway.app/api/:path*"
    }
  ]
}
```

Reemplaza `tu-backend-railway.up.railway.app` con la URL de tu app en Railway.

---

## 🛠️ Configuración en Railway (Backend)

### 1. Crear servicio en Railway

1. **New Project** → Selecciona tu repo
2. **Add PostgreSQL**: Railway te da una DB PostgreSQL automáticamente
3. **Variables de entorno**:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   PORT=5000
   ```
   (Railway las configura automáticamente)

### 2. Configurar el backend

Railway detecta `Procfile` o `start.sh`. Asegúrate de que tu `start.sh` ejecuta:

```bash
#!/bin/bash
cd /app/backend-python
python3 app.py
```

O usa un `Procfile`:
```
web: cd backend-python && python3 app.py
```

### 3. Dependencias Python

Crea `backend-python/requirements.txt`:
```
Flask==3.0.0
flask-cors==4.0.0
psycopg2-binary==2.9.9
gunicorn==21.2.0
```

Railway instalará automáticamente con `pip install -r requirements.txt`.

### 4. Comando de inicio (Railway)

En **Settings → Deploy**:
```bash
cd backend-python && gunicorn -b 0.0.0.0:$PORT app:app
```

---

## 🔄 Flujo de trabajo después del despliegue

1. **Push a GitHub** → Vercel y Railway redesplegan automáticamente
2. **Las fotos NO se pierden** porque están en PostgreSQL (Railway)
3. **Poemas/Canciones/Meses** también están en PostgreSQL

---

## 🧪 Probar localmente antes de desplegar

```bash
# Backend
cd backend-python
python3 app.py
# Se ejecuta en http://127.0.0.1:5000

# Frontend (en otra terminal)
cd ..
python3 -m http.server 8000
# Abre http://127.0.0.1:8000/index.html
```

---

## 📌 URLs importantes

- **Frontend Vercel**: `https://tu-proyecto.vercel.app`
- **Backend Railway**: `https://tu-backend.up.railway.app`
- **Base de datos**: Railway PostgreSQL (URL en variables de entorno)

---

## 🐛 Troubleshooting

### Problema: "No se cargan las fotos"
✅ **Verifica** que `vercel.json` tenga el rewrite correcto  
✅ **Verifica** que Railway esté corriendo sin errores  
✅ **Abre DevTools** (F12) y revisa errores de CORS o 404

### Problema: "Error de conexión a la base de datos"
✅ **Verifica** que Railway tenga PostgreSQL conectado  
✅ **Revisa** la variable `DATABASE_URL` en Railway Settings

### Problema: "Las fotos antiguas desaparecieron"
✅ **Normal**: al migrar se borró la tabla antigua (con URLs de archivos)  
✅ **Sube nuevamente** las fotos usando el formulario → quedarán en la DB

---

## 🎯 ¡Listo!

Ahora cada vez que hagas cambios:
1. **Commit + Push** a GitHub
2. Vercel y Railway **redesplegan automáticamente**
3. Las fotos **persisten en PostgreSQL** sin problemas

💙 **Disfruta tu página desplegada en producción** 🚀
