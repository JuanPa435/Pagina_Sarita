# 🚂 Desplegar en Railway - Instrucciones

## ✅ **El proyecto está listo para Railway**

### 📋 **Pasos para desplegar:**

1. **Ve a https://railway.app**

2. **Inicia sesión con GitHub**

3. **Click en "New Project"**

4. **Selecciona "Deploy from GitHub repo"**

5. **Busca y selecciona: `Pagina_Sarita`**

6. **Espera que termine el deploy** (~2-3 minutos)

7. **Genera tu dominio público:**
   - Dentro del proyecto, haz clic en tu servicio
   - Ve a "Settings"
   - Busca "Networking" o "Public Networking"
   - Click en "Generate Domain"
   - Te dará una URL como: `tu-proyecto.up.railway.app`

8. **¡Listo!** Abre tu URL y todo funcionará:
   - ✅ Ver poemas/canciones/mensajes
   - ✅ Agregar nuevos
   - ✅ Editar existentes
   - ✅ Borrar
   - ✅ Sistema de backups automático

---

## 🔧 **Configuración del Webhook (opcional):**

Si quieres recibir notificaciones de Railway en tu proyecto:

1. En Railway, ve a "Settings" del proyecto
2. Click en "Webhooks"
3. Usa esta URL: `https://tu-dominio.up.railway.app/webhook`

---

## 🔄 **Para actualizar después:**

1. Haz cambios en tu código
2. Commit y push:
   ```bash
   git add -A
   git commit -m "tu mensaje"
   git push
   ```
3. Railway detectará el push automáticamente
4. Redesplegará tu app (~1-2 minutos)

---

## ✨ **Lo que funciona:**

✅ Guardar poemas/canciones/mensajes permanentemente  
✅ Editar cualquier elemento  
✅ Borrar elementos  
✅ Sistema de backups automático (guarda últimos 5)  
✅ Todo persiste entre reinicios  
✅ Webhook para notificaciones  

---

**¡Todo listo! Solo despliega en Railway y funcionará perfectamente! 🚀**
