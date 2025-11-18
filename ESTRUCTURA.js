// ==================================
// PROYECTO: Nuestra Historia 💙
// ==================================

/**
 * ESTRUCTURA DE CARPETAS:
 * 
 * /poemas/           - Sección de poemas románticos
 * /canciones/        - Sección de canciones especiales
 * /mensajes/         - Sección de mensajes de amor
 * /galeria/          - Sección de fotos y recuerdos
 * /styles/           - Archivos CSS organizados por sección
 * /assets/           - Recursos estáticos (imágenes, iconos)
 * /backend-python/   - Backend Flask + PostgreSQL
 * /uploads/          - Archivos subidos por usuarios
 * 
 * ARCHIVOS RAÍZ:
 * - index.html       - Página principal
 * - config.js        - Configuración del backend
 * - index.js         - JavaScript principal
 * - README.md        - Documentación del proyecto
 */

/**
 * BASE DE DATOS POSTGRESQL:
 * 
 * Tablas:
 * - poemas (id, titulo, contenido, autor, created_at, updated_at)
 * - canciones (id, titulo, artista, url, razon, dedicado_por, created_at, updated_at)
 * - mensajes (id, asunto, contenido, fecha, created_at, updated_at)
 * - galeria (id, titulo, descripcion, url, created_at, updated_at)
 * 
 * Campo especial:
 * - canciones.dedicado_por: 'Sarita' o 'JP' (quien dedica la canción)
 */

/**
 * BACKEND API ENDPOINTS:
 * 
 * Poemas:
 * - GET  /api/poemas/get    - Obtener todos los poemas
 * - POST /api/poemas/save   - Guardar poemas
 * 
 * Canciones:
 * - GET  /api/canciones/get  - Obtener todas las canciones
 * - POST /api/canciones/save - Guardar canciones
 * 
 * Mensajes:
 * - GET  /api/mensajes/get   - Obtener todos los mensajes
 * - POST /api/mensajes/save  - Guardar mensajes
 * 
 * Salud:
 * - GET  /health             - Verificar estado del backend
 */

console.log('📋 Estructura del proyecto cargada');
