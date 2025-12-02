# Despliegue en Vercel

## Variables de Entorno Requeridas

En Vercel, debes configurar estas variables de entorno:

```bash
DB_HOST=tu_host_mysql
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_base_datos
```

## Estructura del Proyecto

- `/api/index.py` - Serverless function handler para Flask
- `/backend/app.py` - Aplicación Flask principal
- `/conexion/db.py` - Conexión a MySQL
- `vercel.json` - Configuración de Vercel

## Comandos de Despliegue

### Despliegue Automático
Vercel despliega automáticamente cuando haces push a GitHub.

### Despliegue Manual
```bash
vercel --prod
```

## Configuración Local

Para desarrollo local:
```bash
# Backend
python backend/app.py

# Frontend (puerto 8000)
python -m http.server 8000
```

## Logs y Debugging

Para ver logs en Vercel:
1. Ve a tu proyecto en vercel.com
2. Click en "Deployments"
3. Click en el deployment
4. Click en "Functions" > "api/index"
5. Ve los logs en tiempo real
