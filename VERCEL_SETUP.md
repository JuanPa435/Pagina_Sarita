# 🚀 Configuración de Vercel para Pagina_Sarita

## 1. Variables de Entorno en Vercel

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**

Agrega SOLO esta variable:

```
DATABASE_URL=mysql://root:vDJxpYSfkvKcDFSwgVQQYMaYIcLfFSkz@tramway.proxy.rlwy.net:51234/railway
```

## 2. Verificación

Después de hacer redeploy, prueba estos endpoints:

### Health Check (debe funcionar siempre):
```
https://tu-dominio.vercel.app/api/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "message": "Backend is running on Vercel",
  "python_version": "..."
}
```

### Poemas (requiere DB configurada):
```
https://tu-dominio.vercel.app/api/poemas/get
```

## 3. Troubleshooting

Si el backend no funciona:

1. **Ver logs**: Vercel → Deployments → Click en deployment → Functions → Logs
2. **Verificar build**: Vercel → Deployments → Click en deployment → Building
3. **Variables de entorno**: Settings → Environment Variables → Verificar DATABASE_URL

## 4. Estructura de Archivos para Vercel

```
/backend/index.py      → Handler de Vercel (punto de entrada)
/backend/app.py        → Aplicación Flask principal
/conexion/db.py        → Conexión a MySQL
/vercel.json           → Configuración de Vercel
/requirements.txt      → Dependencias Python
```

## 5. Si algo falla

Ejecuta localmente para debuggear:
```bash
cd backend
python app.py
```

Luego prueba: `http://localhost:5050/api/poemas/get`
