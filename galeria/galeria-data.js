const GALERIA = [
  // Estructura: { src: '/uploads/galeria/archivo.jpg', autor: 'Nombre', descripcion: 'Texto', fecha: 'YYYY-MM-DD' }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fotos: GALERIA, GALERIA };
}
