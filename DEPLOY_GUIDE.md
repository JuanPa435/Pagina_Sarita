# 🚀 GUÍA: Deploy Frontend en Netlify + Backend en Vercel

Tu aplicación ahora está lista para producción. Aquí está el proceso paso a paso:

## ⚠️ IMPORTANTE: Se ha cambiado la estructura

Se creó `/api/index.js` que es lo que Vercel usará como backend serverless.

---

## 📋 PASO 1: Preparar el Repositorio

```bash
cd /workspaces/Pagina_Sarita

# Agregar todo
git add -A

# Hacer commit
git commit -m "🚀 Setup para Netlify + Vercel deployment"

# Subir a GitHub
git push
```

---

## 🔵 PASO 2: Deploy Backend en Vercel

### 2.1 Acceder a Vercel
1. Ve a https://vercel.com
2. Haz clic en "Sign up" → Registrate con GitHub
3. Conecta tu cuenta de GitHub

### 2.2 Importar Proyecto
1. Haz clic en "Add New Project"
2. Selecciona tu repositorio `Pagina_Sarita`
3. Haz clic en "Import"

### 2.3 Configuración de Deploy
- **Framework Preset:** Node.js
- **Build Command:** `npm install`
- **Output Directory:** `.`
- **Environment Variables:** (dejar vacío por ahora)

### 2.4 Deploy
Haz clic en "Deploy" - espera a que termine (2-3 minutos)

### 2.5 Obtener URL del Backend
Una vez desplegado, verás una URL como:
```
https://pagina-sarita-xxxxx.vercel.app
```

**Copia esta URL** - la necesitarás en el siguiente paso.

---

## 🔶 PASO 3: Deploy Frontend en Netlify

### 3.1 Preparar config.js con URL de Vercel

1. Edita `/workspaces/Pagina_Sarita/config.js`
2. Encuentra esta línea:
```javascript
return 'https://pagina-sarita-backend.vercel.app/api';
```

3. Reemplázala con tu URL de Vercel (la que obtuviste en Paso 2.5):
```javascript
return 'https://tu-url-vercel.vercel.app/api';
```

4. Guarda y haz push:
```bash
git add config.js
git commit -m "🔗 Actualizar URL del backend para Vercel"
git push
```

### 3.2 Acceder a Netlify
1. Ve a https://netlify.com
2. Haz clic en "Sign up" → Registrate con GitHub
3. Conecta tu cuenta

### 3.3 Conectar Repositorio
1. Haz clic en "Add new site" → "Import an existing project"
2. Selecciona tu repositorio `Pagina_Sarita`

### 3.4 Configuración de Build
- **Base directory:** (dejar vacío)
- **Build command:** (dejar vacío - no necesita compilar)
- **Publish directory:** `.` (la raíz del proyecto)

### 3.5 Deploy
Haz clic en "Deploy" - espera a que termine (1-2 minutos)

### 3.6 Obtener URL del Frontend
Una vez desplegado, verás una URL como:
```
https://pagina-sarita-xxxxx.netlify.app
```

---

## ✅ VERIFICACIÓN

Una vez desplegado todo, prueba:

1. **Abre tu URL de Netlify** en el navegador
2. **Navega a Poemas/Canciones/Mensajes**
3. **Agrega/edita algo** - debería guardar en Vercel

Si todo funciona:
- ✅ Los datos se cargan
- ✅ Puedes crear/editar/eliminar items
- ✅ Los datos persisten al recargar

---

## 🐛 TROUBLESHOOTING

### Los datos no cargan
- **Solución:** Verifica que la URL en `config.js` sea correcta
- **Comando:** `grep -n "vercel.app" /workspaces/Pagina_Sarita/config.js`

### Error CORS
- **Causa:** El backend no está en Vercel
- **Solución:** Completa PASO 2 primero

### Error 404 en API
- **Causa:** La URL de Vercel no es correcta
- **Solución:** Copia exactamente la URL que Vercel te dio

### "Cannot GET /api/poemas/get"
- **Causa:** El archivo `api/index.js` no se desplegó
- **Solución:** Haz push de los cambios nuevamente

---

## 🔄 DESARROLLO LOCAL

Para seguir desarrollando localmente, sigue usando:

```bash
bash start-all.sh
```

Esto iniciará:
- Backend local en `http://localhost:3000`
- Frontend local en `http://localhost:8080`

El `config.js` detectará automáticamente que estás en localhost y usará `http://localhost:3000/api`.

---

## 📝 RESUMEN

| Componente | Dónde | URL |
|-----------|-------|-----|
| Backend | Vercel | `https://tu-url-vercel.vercel.app` |
| Frontend | Netlify | `https://tu-url-netlify.netlify.app` |
| Config | `config.js` | Detecta automáticamente |

---

## 🎉 ¡LISTO!

Ahora tu aplicación está en la nube y cualquiera puede acceder con solo compartir el link de Netlify.

Los datos se guardan en Vercel automáticamente.

**Comparte tu URL de Netlify con quien quieras** 💕
