# 🎉 Apartado de Meses

Este apartado reemplaza el antiguo de **Mensajes**. Aquí se guardan las celebraciones o recuerdos de cada mes juntos.

## 🗂 Campos
- `mes`: Nombre o identificador (Ej: "Mes 1", "Junio", "3º Mes")
- `descripcion`: Recuerdo especial, reflexión o lo que significó ese mes

## 🔄 API Backend
- `GET /api/meses/get` → Lista todos los meses guardados
- `POST /api/meses/save` → Reemplaza la lista completa de meses

Ejemplo guardar:
```json
{
  "meses": [
    { "mes": "Mes 1", "descripcion": "Nuestro inicio 💙" },
    { "mes": "Mes 2", "descripcion": "Más complicidad y risas" }
  ]
}
```

## ➕ Agregar / Editar
Desde `meses.html` puedes:
1. Agregar nuevo mes
2. Editar descripción
3. Eliminar un registro

## 💾 Persistencia
Los datos se guardan en PostgreSQL (tabla `meses`).

```sql
CREATE TABLE meses (
  id SERIAL PRIMARY KEY,
  mes TEXT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Notas
- Se eliminó completamente el módulo anterior de Mensajes.
- Si necesitas recuperar algo, quedó un backup en `mensajes/`.

Hecho con 💙 para seguir celebrando cada etapa de Nuestra Historia.
