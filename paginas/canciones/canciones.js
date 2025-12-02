function mostrarCanciones() {
    const container = document.getElementById('canciones-container');
    if (!container) return;
    container.innerHTML = '';
    const cnt = document.getElementById('canciones-count');
    if (cnt) cnt.textContent = `(${cancionesEnPantalla.length})`;
    const inicio = (paginaActual - 1) * CANCIONES_POR_PAGINA;
    const fin = inicio + CANCIONES_POR_PAGINA;
    const cancionesEnPagina = cancionesEnPantalla.slice(inicio, fin);
    if (cancionesEnPagina.length === 0) {
        container.innerHTML = `<div class="no-items">No se encontraron canciones...</div>`;
        actualizarPaginacion();
        return;
    }
    cancionesEnPagina.forEach((cancion, index) => {
        const indicePrincipal = inicio + index;
        const div = document.createElement('div');
        div.className = 'cancion-card';
        div.innerHTML = `
            <h3>Canción #${indicePrincipal + 1}: ${cancion.titulo}</h3>
            <div class="cancion-artista">${cancion.artista}</div>
            <div class='cancion-dedicatoria'><strong>Dedicatoria:</strong> ${cancion.dedicatoria ? cancion.dedicatoria : '<span style="opacity:0.6">(Sin dedicatoria)</span>'}</div>
            ${cancion.dedicador ? `<span class='dedicador'>Dedicado por: ${cancion.dedicador}</span>` : ''}
            ${cancion.url ? `<a href='${cancion.url}' target='_blank' class='btn-escuchar'>🎧 Escuchar</a>` : ''}
            
            <span class="fecha">${cancion.fecha || ''}</span>
            <div class="botones-cancion-menu">
                <button class="btn-menu-toggle" onclick="toggleMenuCancion(this)">+</button>
                <div class="botones-cancion-desplegable">
                    <button class="btn-editar" onclick="editarCancion(${indicePrincipal})">✎ Editar</button>
                    <button class="btn-eliminar" onclick="eliminarCancion(${indicePrincipal})">🗑️ Eliminar</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
    actualizarPaginacion();
}
// JS para la página de canciones, inspirado en poemas.js

const CANCIONES_POR_PAGINA = 12;
let paginaActual = 1;
let cancionDatosEditando = null;
let cancionesEnPantalla = [];
let CANCIONES = [];

// Cargar canciones desde el backend
async function cargarCancionesDelBackend() {
    try {
        const res = await fetch(`${CONFIG.BACKEND_URL}/canciones/get`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.canciones)) {
            // Mapear campos del backend a los usados en frontend
            CANCIONES = data.canciones.map(cancion => ({
                ...cancion,
                dedicatoria: cancion.razon || '',
                dedicador: cancion.dedicadoPor || cancion.dedicado_por || '',
            }));
            cancionesEnPantalla = [...CANCIONES];
            const cnt = document.getElementById('canciones-count');
            if (cnt) cnt.textContent = `(${CANCIONES.length})`;
            return true;
        }
    } catch (err) {
        console.error('❌ Error al cargar canciones:', err);
    }
    return false;
}

// Guardar canciones en el backend
async function guardarCancionesEnBackend() {
    try {
        const res = await fetch(`${CONFIG.BACKEND_URL}/canciones/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ canciones: CANCIONES })
        });
        const data = await res.json();
        if (data.success) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

function filtrarCanciones(texto) {
    texto = texto.toLowerCase().trim();
    if (texto === '') {
        cancionesEnPantalla = [...CANCIONES];
    } else {
        cancionesEnPantalla = CANCIONES.filter(cancion => 
            cancion.titulo.toLowerCase().includes(texto) ||
            cancion.artista.toLowerCase().includes(texto)
        );
    }
    paginaActual = 1;
    mostrarCanciones();
}


function actualizarPaginacion() {
    const totalPaginas = Math.ceil(cancionesEnPantalla.length / CANCIONES_POR_PAGINA);
    const paginacionDiv = document.getElementById('paginacion');
    paginacionDiv.innerHTML = '';
    const btnAnterior = document.createElement('button');
    btnAnterior.className = 'pagina-btn ' + (paginaActual === 1 ? 'deshabilitada' : '');
    btnAnterior.textContent = '← Anterior';
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.onclick = () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarCanciones();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    paginacionDiv.appendChild(btnAnterior);
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagina-btn ' + (i === paginaActual ? 'activa' : '');
        btn.textContent = i;
        btn.onclick = () => {
            paginaActual = i;
            mostrarCanciones();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        paginacionDiv.appendChild(btn);
    }
    const btnSiguiente = document.createElement('button');
    btnSiguiente.className = 'pagina-btn ' + (paginaActual === totalPaginas ? 'deshabilitada' : '');
    btnSiguiente.textContent = 'Siguiente →';
    btnSiguiente.disabled = paginaActual === totalPaginas;
    btnSiguiente.onclick = () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarCanciones();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    paginacionDiv.appendChild(btnSiguiente);
}

function mostrarModal(titulo = 'Agregar Canción') {
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-cancion').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-abierto');
}

function cerrarModal() {
    document.getElementById('modal-cancion').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.body.classList.remove('modal-abierto');
    document.getElementById('form-cancion').reset();
    cancionDatosEditando = null;
}

function abrirFormularioAgregar() {
    cancionDatosEditando = null;
    document.getElementById('form-cancion').reset();
    mostrarModal('Agregar Canción');
}

function editarCancion(indice) {
    if (!CANCIONES[indice]) {
        alert('Error: Canción no encontrada');
        return;
    }
    cancionDatosEditando = indice;
    const cancion = CANCIONES[indice];
    document.getElementById('cancion-titulo').value = cancion.titulo;
    document.getElementById('cancion-artista').value = cancion.artista;
    document.getElementById('cancion-dedicatoria').value = cancion.dedicatoria || '';
    document.getElementById('cancion-url').value = cancion.url || '';
    // Seleccionar el radio del dedicador
    if (cancion.dedicador) {
        const radios = document.getElementsByName('cancion-dedicador');
        for (let i = 0; i < radios.length; i++) {
            radios[i].checked = (radios[i].value === cancion.dedicador);
        }
    }
    mostrarModal('Editar Canción');
}

async function eliminarCancion(indice) {
    if (!CANCIONES[indice]) {
        alert('Error: Canción no encontrada');
        return;
    }
    const titulo = CANCIONES[indice].titulo;
    showConfirm(`¿Seguro que quieres eliminar la canción "${titulo}"?`, async () => {
        // Loader visual
        let loader = document.getElementById('loader-cancion');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loader-cancion';
            loader.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;font-size:2em;color:#4a2fa9;display:none;';
            loader.innerHTML = '<span>Eliminando...</span>';
            document.body.appendChild(loader);
        } else {
            loader.innerHTML = '<span>Eliminando...</span>';
        }
        loader.style.display = 'flex';
        CANCIONES.splice(indice, 1);
        cancionesEnPantalla = [...CANCIONES];
        mostrarCanciones();
        try {
            await guardarCancionesEnBackend();
        } catch (err) {
            alert('Error inesperado al eliminar. Revisa consola.');
        }
        loader.style.display = 'none';
    }, () => {/* cancel noop */});
}

function toggleMenuCancion(btn) {
    const menu = btn.parentElement.querySelector('.botones-cancion-desplegable');
    menu.classList.toggle('visible');
    btn.classList.toggle('activo');
}

// Confirm overlay helper
function showConfirm(message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.style = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:10000;display:flex;align-items:center;justify-content:center;';
    const box = document.createElement('div');
    box.style = 'background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.25);padding:1.3rem;max-width:380px;width:92%;text-align:center;font-family:Montserrat, Arial, sans-serif;color:#232946;';
    box.innerHTML = `
        <h4 style="margin:0 0 .8rem 0;color:#4a2fa9;font-weight:800;">Confirmar</h4>
        <p style="margin:0 0 1rem 0;">${message}</p>
        <div style="display:flex;gap:.8rem;justify-content:center;">
            <button id="confirm-cancel" style="background:#eee;border:none;border-radius:12px;padding:.6rem 1rem;font-weight:700;cursor:pointer;">Cancelar</button>
            <button id="confirm-ok" style="background:linear-gradient(90deg,#fcbecd,#f97878);color:#350000;border:none;border-radius:12px;padding:.6rem 1rem;font-weight:700;cursor:pointer;">Sí, eliminar</button>
        </div>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    const cleanup = () => overlay.remove();
    box.querySelector('#confirm-cancel').onclick = () => { cleanup(); onCancel && onCancel(); };
    box.querySelector('#confirm-ok').onclick = () => { cleanup(); onConfirm && onConfirm(); };
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.botones-cancion-menu')) {
        document.querySelectorAll('.botones-cancion-desplegable.visible').forEach(menu => {
            menu.classList.remove('visible');
            menu.previousElementSibling.classList.remove('activo');
        });
    }
});

document.addEventListener('DOMContentLoaded', async () => {
            // Navbar toggle (hamburger)
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.getElementById('menu-simple');
            if (navToggle && navMenu) {
                navToggle.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const abierto = navMenu.classList.toggle('open');
                    navToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
                    console.log('Menu toggled:', abierto);
                });
                // Cerrar al pulsar links
                navMenu.querySelectorAll('a').forEach(function(link) {
                    link.addEventListener('click', function() {
                        navMenu.classList.remove('open');
                        navToggle.setAttribute('aria-expanded', 'false');
                    });
                });
                // Cerrar al hacer click fuera
                document.addEventListener('click', function(e) {
                    if (!e.target.closest('.navbar-simple')) {
                        navMenu.classList.remove('open');
                        navToggle.setAttribute('aria-expanded', 'false');
                    }
                });
            }
            // Buscador funcional
            const buscadorInput = document.getElementById('buscador-canciones');
            if (buscadorInput) {
                buscadorInput.addEventListener('input', (e) => {
                    filtrarCanciones(e.target.value);
                });
            }
            // Buscador desplegable
            const btnSearchToggle = document.getElementById('btn-search-toggle-canciones');
            const searchExpandable = document.getElementById('search-expandable-canciones');
            const searchOverlay = document.getElementById('search-overlay-canciones');
            const btnLimpiarBusqueda = document.getElementById('btn-limpiar-busqueda');
            
            let searchExpanded = false;
            
            function closeSearch() {
                searchExpanded = false;
                if (searchExpandable) searchExpandable.classList.remove('active');
                if (searchOverlay) searchOverlay.classList.remove('active');
                if (buscadorInput) buscadorInput.value = '';
                filtrarCanciones('');
                document.body.style.overflow = '';
            }
            
            if (btnSearchToggle && searchExpandable) {
                btnSearchToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    searchExpanded = !searchExpanded;
                    if (searchExpanded) {
                        searchExpandable.classList.add('active');
                        if (window.innerWidth <= 480 && searchOverlay) {
                            searchOverlay.classList.add('active');
                            document.body.style.overflow = 'hidden';
                        }
                        setTimeout(() => buscadorInput.focus(), 300);
                    } else {
                        closeSearch();
                    }
                });
            }
            
            // Cerrar al hacer clic en overlay
            if (searchOverlay) {
                searchOverlay.addEventListener('click', closeSearch);
            }
            
            // Cerrar buscador al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (searchExpanded && !e.target.closest('.search-container')) {
                    closeSearch();
                }
            });
            
            // Cerrar con tecla Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchExpanded) {
                    closeSearch();
                }
            });
            
            // Botón limpiar (X)
            if (btnLimpiarBusqueda) {
                btnLimpiarBusqueda.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeSearch();
                });
            }
    await cargarCancionesDelBackend();
    mostrarCanciones();
    document.getElementById('btn-agregar-cancion').addEventListener('click', abrirFormularioAgregar);
    // Loader visual
    const loader = document.createElement('div');
    loader.id = 'loader-cancion';
    loader.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;font-size:2em;color:#4a2fa9;display:none;';
    loader.innerHTML = '<span>Guardando...</span>';
    document.body.appendChild(loader);

    document.getElementById('form-cancion').addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const titulo = document.getElementById('cancion-titulo').value.trim();
        const artista = document.getElementById('cancion-artista').value.trim();
        const dedicatoria = document.getElementById('cancion-dedicatoria') ? document.getElementById('cancion-dedicatoria').value.trim() : '';
        const url = document.getElementById('cancion-url') ? document.getElementById('cancion-url').value.trim() : '';
        let dedicador = '';
        const radios = document.getElementsByName('cancion-dedicador');
        radios.forEach(radio => { if (radio.checked) dedicador = radio.value; });

        if (!titulo || !artista) {
            alert('Por favor completa el título y artista de la canción');
            return;
        }

        // Loader visual
        let loader = document.getElementById('loader-cancion');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loader-cancion';
            loader.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;font-size:2em;color:#4a2fa9;display:none;';
            loader.innerHTML = '<span>Guardando...</span>';
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
        document.querySelector('.btn-guardar').disabled = true;

        const nuevaCancion = { 
            titulo, 
            artista, 
            url, 
            razon: dedicatoria, 
            dedicadoPor: dedicador 
        };

        if (cancionDatosEditando !== null) {
            CANCIONES[cancionDatosEditando] = nuevaCancion;
        } else {
            CANCIONES.push(nuevaCancion);
        }
        try {
            await guardarCancionesEnBackend();
            // Recargar desde backend para obtener los datos tal como se guardaron
            await cargarCancionesDelBackend();
            cancionesEnPantalla = [...CANCIONES];
            mostrarCanciones();
        } catch (err) {
            alert('Error inesperado al guardar. Revisa consola.');
        }
        loader.style.display = 'none';
        document.querySelector('.btn-guardar').disabled = false;
        cancionDatosEditando = null;
        cerrarModal();
    });
    document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarModal);
    document.getElementById('btn-cancelar').addEventListener('click', cerrarModal);
    document.getElementById('modal-cancion').addEventListener('click', (e) => {
        if (e.target.id === 'modal-cancion') {
            cerrarModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('modal-cancion').style.display === 'flex') {
            cerrarModal();
        }
    });
});
