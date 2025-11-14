# 🚀 DEPLOY EN VERCEL - SOLO UNA PLATAFORMA

**Mucho más simple:** Frontend + Backend en Vercel, todo junto.

---

## 📋 ESTRUCTURA

```
Vercel
├── Frontend (HTML/CSS/JS) ← Archivos estáticos
├── Backend API (/api) ← Node.js serverless
└── Datos (poemas-data.js, etc)
```

Cuando abres `https://tu-app.vercel.app`:
- Se carga el frontend desde Vercel
- El frontend llama a `/api/poemas/get` en el mismo servidor
- Vercel procesa la API y retorna datos
- Todo funciona 🎉

---

## ✅ YA ESTÁ CONFIGURADO

Los cambios hechos:

✅ `vercel.json` - Configurado para servir frontend + API  
✅ `config.js` - Usa `/api` (misma URL)  
✅ `poemas.html`, `canciones.html`, `mensajes.html` - Listos  
✅ `api/index.js` - Backend serverless  

---

## 🎯 PASOS PARA DEPLOYAR

### 1️⃣ Vercel - Deploy (5 min)

1. Ve a https://vercel.com
2. Sign up con GitHub (si no tienes cuenta)
3. Click "Add New Project"
4. Selecciona `Pagina_Sarita`
5. **Configuración:**
   - Framework: Dejar en "Other"
   - Build Command: `npm install`
   - Output Directory: `.` (punto)
   - Environment: (dejar vacío)
6. Click "Deploy"
7. Espera ~3 minutos
8. ✅ **¡LISTO!** Te da una URL como: `https://pagina-sarita-xxxxx.vercel.app`

---

## 🧪 PRUEBA

Abre tu URL en el navegador:

```
https://tu-app.vercel.app
```

Debería ver:
- ✅ Portada con poemas, canciones, mensajes
- ✅ Todas las funciones funcionan
- ✅ Puedes crear/editar/eliminar items
- ✅ Los datos persisten

---

## ⚠️ SI ALGO NO FUNCIONA

### "Cannot GET /api/poemas/get"
→ Vercel no desplegó `api/index.js`  
→ Solución: Click "Redeploy" en Vercel

### "Los datos no cargan"
→ El servidor Backend no está corriendo  
→ Solución: Espera 30 segundos y recarga

### "Error 500"
→ Error en el backend  
→ Ve a Vercel → Logs → Ve qué está mal

### "Cannot find module..."
→ Faltan dependencias npm  
→ Solución: Verifica `package.json`

---

## 📁 ESTRUCTURA FINAL

```
/workspaces/Pagina_Sarita/
├── api/
│   └── index.js              ← Backend API
├── poemas/
│   ├── poemas.html           ← Frontend
│   └── poemas-data.js        ← Datos
├── canciones/
│   ├── canciones.html        ← Frontend
│   └── canciones-data.js     ← Datos
├── mensajes/
│   ├── mensajes.html         ← Frontend
│   └── mensajes-data.js      ← Datos
├── config.js                 ← Config automática
├── index.html                ← Portada
├── script.js                 ← JS compartido
├── vercel.json               ← Config Vercel
└── package.json              ← Dependencias
```

---

## 🎉 RESULTADO

**Una sola URL. Una sola plataforma.**

Compartes: `https://tu-app.vercel.app`

¡Y listo! Todos pueden ver tu app.

---

## 📞 REFERENCIA RÁPIDA

| Acción | Comando |
|--------|---------|
| Hacer push | `git push` |
| Redeploy en Vercel | Click "Redeploy" en dashboard |
| Ver logs | Vercel → Deployments → View Logs |
| Desarrollo local | `bash start-all.sh` |

---

**¡Tu app está lista para el mundo!** 🌍💕
