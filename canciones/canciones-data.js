const CANCIONES = [
  {
    "titulo": "Test",
    "artista": "Test Artist",
    "enlace": "https://test.com"
  }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { canciones: CANCIONES, CANCIONES };
}