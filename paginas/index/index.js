// JS principal para el index
// Incluye animaciones, contador de días y previews

// Configuración de fechas
const FECHA_INICIO = new Date(2025, 4, 6); // mayo = 4 (0-indexed), día 6

function calcularDiasJuntos() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const inicio = new Date(FECHA_INICIO);
    inicio.setHours(0, 0, 0, 0);
    const diferencia = hoy - inicio;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const diasEl = document.getElementById('diasCounter');
    if (diasEl) diasEl.textContent = dias;
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const dia = FECHA_INICIO.getDate();
    const mes = meses[FECHA_INICIO.getMonth()];
    const anio = FECHA_INICIO.getFullYear();
    const fechaFormato = `${dia} de ${mes} de ${anio}`;
    const sinceEl = document.getElementById('sinceDate');
    if (sinceEl) sinceEl.textContent = `Desde el ${fechaFormato}`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Navbar hamburger toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('menu-simple');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const abierto = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
            console.log('Menu toggled:', abierto);
        });
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.navbar-simple')) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    calcularDiasJuntos();
    // Aquí puedes agregar más inicializaciones para previews, animaciones, etc.
});

// Helpers para fetch y render de previews
const fetchPreview = async (endpoint) => {
    try {
        const res = await fetch(`${CONFIG.BACKEND_URL}/${endpoint}`);
        const data = await res.json();
        if (data.success) return data;
        return null;
    } catch (e) {
        return null;
    }
};

function renderPoemasPreview(poemas) {
    const cont = document.getElementById('poemasPreview');
    if (!cont) return;
    cont.innerHTML = '';
    if (!poemas || poemas.length === 0) {
        cont.innerHTML = '<p class="no-items">Aún no hay poemas... pero aquí escribiré nuestras historias 🌹</p>';
        return;
    }
    poemas.slice(-3).reverse().forEach(poema => {
        const el = document.createElement('div');
        el.className = 'item-card';
        el.innerHTML = `<h3>${poema.titulo}</h3><div class='preview-content'>${poema.contenido.replace(/\n/g, ' ').slice(0, 180)}${poema.contenido.length > 180 ? '...' : ''}</div><div class='meta'>${poema.autor ? 'Por ' + poema.autor : ''}</div>`;
        cont.appendChild(el);
    });
}

function renderCancionesPreview(canciones) {
    const cont = document.getElementById('cancionesPreview');
    if (!cont) return;
    cont.innerHTML = '';
    if (!canciones || canciones.length === 0) {
        cont.innerHTML = '<p class="no-items">Nuestras canciones favoritas estarán aquí 🎶</p>';
        return;
    }
    canciones.slice(-3).reverse().forEach(cancion => {
        const el = document.createElement('div');
        el.className = 'item-card';
        el.innerHTML = `<h3>${cancion.titulo} <span style='font-weight:400;'>- ${cancion.artista}</span></h3><div class='preview-content'>${cancion.razon ? cancion.razon.slice(0, 120) + (cancion.razon.length > 120 ? '...' : '') : ''}</div><div class='meta'>${cancion.dedicadoPor ? 'Dedicado por ' + cancion.dedicadoPor : ''}</div>`;
        cont.appendChild(el);
    });
}

function renderRecuerdosPreview(recuerdos) {
    const cont = document.getElementById('galeriaPreview');
    if (!cont) return;
    cont.innerHTML = '';
    if (!recuerdos || recuerdos.length === 0) {
        cont.innerHTML = '<p class="no-items">Aquí estarán nuestros recuerdos más especiales 📷</p>';
        return;
    }
    // Filtrar solo recuerdos con imagen válida (id y url presentes)
    const conImagen = recuerdos.filter(r => r.url && r.id);
    cont.innerHTML = '';
    conImagen.slice(0, 3).forEach(recuerdo => {
        const el = document.createElement('div');
        el.className = 'gallery-item';
        const imgUrl = CONFIG.BACKEND_URL.replace(/\/api$/, '') + recuerdo.url;
        // Formatear fecha
        const fechaObj = new Date(recuerdo.fecha);
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        const fechaFormato = `${fechaObj.getDate()} ${meses[fechaObj.getMonth()]} ${fechaObj.getFullYear()}`;
        el.innerHTML = `
            <div class="recuerdo-card-flip">
                <div class="recuerdo-flip-inner">
                    <div class="recuerdo-flip-front">
                        <img src="${imgUrl}" alt="Recuerdo" />
                    </div>
                </div>
            </div>
            <div class="recuerdo-preview-fecha">${fechaFormato}</div>
        `;
        cont.appendChild(el);
    });
}

function renderMesesPreview(meses) {
    const cont = document.getElementById('mesesPreview');
    if (!cont) return;
    cont.innerHTML = '';
    if (!meses || meses.length === 0) {
        cont.innerHTML = '<p class="no-items">Nuestras celebraciones mensuales irán aquí 🎊</p>';
        return;
    }
    meses.slice(-3).reverse().forEach((mes, i) => {
        const el = document.createElement('div');
        el.className = 'mes-card';
        el.innerHTML = `<div class='mes-number'>${mes.mes}</div><div class='preview-content'>${mes.descripcion ? mes.descripcion.slice(0, 100) + (mes.descripcion.length > 100 ? '...' : '') : ''}</div>`;
        cont.appendChild(el);
    });
}

async function cargarPreviews() {
    // Poemas
    const poemasData = await fetchPreview('poemas/get');
    renderPoemasPreview(poemasData && poemasData.poemas ? poemasData.poemas : []);
    // Canciones
    const cancionesData = await fetchPreview('canciones/get');
    renderCancionesPreview(cancionesData && cancionesData.canciones ? cancionesData.canciones : []);
    // Recuerdos
    const recuerdosData = await fetchPreview('recuerdos/get');
    renderRecuerdosPreview(recuerdosData && recuerdosData.recuerdos ? recuerdosData.recuerdos : []);
    // Meses
    const mesesData = await fetchPreview('meses/get');
    renderMesesPreview(mesesData && mesesData.meses ? mesesData.meses : []);
}

document.addEventListener('DOMContentLoaded', () => {
    cargarPreviews();
});

// Partículas animadas fondo index
        function randomInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
        function randomColor() {
            const colors = ["#7fe7dc", "#b08df9", "#2eefff", "#ffd6e0", "#fff", "#900677"];
            return colors[randomInt(0, colors.length - 1)];
        }
        function createParticle() {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = randomInt(16, 38);
            p.style.width = p.style.height = size + 'px';
            p.style.left = randomInt(0, 95) + 'vw';
            p.style.top = randomInt(0, 90) + 'vh';
            p.style.background = randomColor();
            p.style.opacity = Math.random() * 0.5 + 0.2;
            p.style.animationDuration = randomInt(8, 16) + 's';
            p.style.animationDelay = randomInt(0, 8) + 's';
            return p;
        }
        window.addEventListener('DOMContentLoaded', () => {
            const bg = document.getElementById('particles-bg');
            if (bg) {
                for (let i = 0; i < 32; i++) {
                    bg.appendChild(createParticle());
                }
            }
        });

        // Contador de días juntos
        function calcularDiasJuntos() {
            const FECHA_INICIO = new Date(2025, 4, 6); // mayo = 4 (0-indexed), día 6
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const inicio = new Date(FECHA_INICIO);
            inicio.setHours(0, 0, 0, 0);
            const diferencia = hoy - inicio;
            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const diasEl = document.getElementById('contador-dias');
            if (diasEl) diasEl.textContent = dias;
        }
        document.addEventListener('DOMContentLoaded', () => {
            calcularDiasJuntos();
        });