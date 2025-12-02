// navbar.js: carga el navbar y activa el menú responsive
function loadNavbar() {
  fetch('/paginas/navbar.html')
    .then(res => res.text())
    .then(html => {
      const navContainer = document.createElement('div');
      navContainer.innerHTML = html;
      document.body.insertAdjacentElement('afterbegin', navContainer.firstElementChild);
      // Cargar estilos globales del navbar
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = '/paginas/styles/navbar.css';
      document.head.appendChild(style);
      // Activar menú responsive
      setTimeout(() => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.getElementById('menu-simple');
        if (navToggle && navMenu) {
          navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
          });
        }
        // Activar link actual
        const links = document.querySelectorAll('.nav-menu-simple a');
        links.forEach(link => {
          if (window.location.pathname === link.getAttribute('href')) {
            link.classList.add('active');
          }
        });
      }, 100);
    });
}
loadNavbar();
