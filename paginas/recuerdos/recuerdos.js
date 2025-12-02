// JS para la página de recuerdos (galería de fotos)

const RECUERDOS_POR_PAGINA = 12;
let paginaActual = 1;
let recuerdoDatosEditando = null;
let recuerdosEnPantalla = [];
let RECUERDOS = [];

// Cargar recuerdos (fotos) desde el backend
async function cargarRecuerdosDelBackend() {
    try {
        const res = await fetch(`${CONFIG.BACKEND_URL}/recuerdos/get`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.recuerdos)) {
            RECUERDOS = data.recuerdos.map(recuerdo => ({
                id: recuerdo.id,
                url: `${CONFIG.BACKEND_URL}${recuerdo.url}`,
                mensaje: recuerdo.mensaje || '',
                fecha: recuerdo.fecha || '',
                dedicatoria: recuerdo.dedicatoria || '',
                autor: recuerdo.autor || ''
            }));
            recuerdosEnPantalla = [...RECUERDOS];
            const cnt = document.getElementById('recuerdos-count');
            if (cnt) cnt.textContent = `(${RECUERDOS.length})`;
            return true;
        }
    } catch (err) {
        console.error('❌ Error al cargar recuerdos:', err);
    }
    return false;
}

// Eliminar un recuerdo del backend
async function eliminarRecuerdoEnBackend(id) {
    try {
        const res = await fetch(`${CONFIG.BACKEND_URL}/recuerdos/delete/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        return data.success;
    } catch (err) {
        console.error('Error eliminando recuerdo:', err);
        return false;
    }
}

function filtrarRecuerdos(texto) {
    texto = texto.toLowerCase().trim();
    if (texto === '') {
        recuerdosEnPantalla = [...RECUERDOS];
    } else {
        recuerdosEnPantalla = RECUERDOS.filter(recuerdo => 
            recuerdo.mensaje.toLowerCase().includes(texto) ||
            (recuerdo.dedicatoria && recuerdo.dedicatoria.toLowerCase().includes(texto)) ||
            (recuerdo.autor && recuerdo.autor.toLowerCase().includes(texto))
        );
    }
    paginaActual = 1;
    mostrarRecuerdos();
}

function mostrarRecuerdos() {
    const container = document.getElementById('recuerdos-grid');
    if (!container) return;
    container.innerHTML = '';
    const cnt = document.getElementById('recuerdos-count');
    if (cnt) cnt.textContent = `(${recuerdosEnPantalla.length})`;
    const inicio = (paginaActual - 1) * RECUERDOS_POR_PAGINA;
    const fin = inicio + RECUERDOS_POR_PAGINA;
    const recuerdosEnPagina = recuerdosEnPantalla.slice(inicio, fin);
    if (recuerdosEnPagina.length === 0) {
        container.innerHTML = `<div class="no-items">No se encontraron recuerdos...</div>`;
        actualizarPaginacion();
        return;
    }
    recuerdosEnPagina.forEach((recuerdo, index) => {
        const indicePrincipal = inicio + index;
        const div = document.createElement('div');
        div.className = 'recuerdo-card';
        div.innerHTML = `
            <img src="${recuerdo.url}" alt="Recuerdo ${indicePrincipal + 1}" class="recuerdo-imagen" loading="lazy">
            <div class="recuerdo-contenido">
                ${recuerdo.mensaje ? `<p class="recuerdo-mensaje">${recuerdo.mensaje}</p>` : ''}
                ${recuerdo.dedicatoria ? `<div class="recuerdo-dedicatoria">${recuerdo.dedicatoria}</div>` : ''}
                ${recuerdo.autor ? `<span class="dedicador">Por: ${recuerdo.autor}</span>` : ''}
                ${recuerdo.fecha ? `<span class="fecha">${recuerdo.fecha}</span>` : ''}
            </div>
            <div class="botones-recuerdo-menu">
                <button class="btn-menu-toggle" onclick="toggleMenuRecuerdo(this)">+</button>
                <div class="botones-recuerdo-desplegable">
                    <button class="btn-eliminar" onclick="eliminarRecuerdo(${recuerdo.id})">🗑️ Eliminar</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
    actualizarPaginacion();
}

function actualizarPaginacion() {
    const totalPaginas = Math.ceil(recuerdosEnPantalla.length / RECUERDOS_POR_PAGINA);
    const paginacionDiv = document.getElementById('paginacion');
    paginacionDiv.innerHTML = '';
    const btnAnterior = document.createElement('button');
    btnAnterior.className = 'pagina-btn ' + (paginaActual === 1 ? 'deshabilitada' : '');
    btnAnterior.textContent = '← Anterior';
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.onclick = () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarRecuerdos();
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
            mostrarRecuerdos();
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
            mostrarRecuerdos();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    paginacionDiv.appendChild(btnSiguiente);
}

function mostrarModal(titulo = 'Agregar Recuerdo') {
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-recuerdo').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-abierto');
}

function cerrarModal() {
    document.getElementById('modal-recuerdo').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.body.classList.remove('modal-abierto');
    document.getElementById('form-recuerdo').reset();
    recuerdoDatosEditando = null;
}

function abrirFormularioAgregar() {
    recuerdoDatosEditando = null;
    document.getElementById('form-recuerdo').reset();
    mostrarModal('Agregar Recuerdo');
}

async function eliminarRecuerdo(id) {
    if (!id) {
        alert('Error: ID de recuerdo inválido');
        return;
    }
    showConfirm(`¿Seguro que quieres eliminar este recuerdo?`, async () => {
        // Loader visual
        let loader = document.getElementById('loader-recuerdo');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loader-recuerdo';
            loader.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;font-size:2em;color:#4a2fa9;display:none;';
            loader.innerHTML = '<span>Eliminando...</span>';
            document.body.appendChild(loader);
        } else {
            loader.innerHTML = '<span>Eliminando...</span>';
        }
        loader.style.display = 'flex';
        try {
            const success = await eliminarRecuerdoEnBackend(id);
            if (success) {
                await cargarRecuerdosDelBackend();
                recuerdosEnPantalla = [...RECUERDOS];
                mostrarRecuerdos();
            } else {
                alert('Error al eliminar el recuerdo');
            }
        } catch (err) {
            alert('Error inesperado al eliminar. Revisa consola.');
        }
        loader.style.display = 'none';
    }, () => {/* cancel noop */});
}

function toggleMenuRecuerdo(btn) {
    const menu = btn.parentElement.querySelector('.botones-recuerdo-desplegable');
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
    if (!e.target.closest('.botones-recuerdo-menu')) {
        document.querySelectorAll('.botones-recuerdo-desplegable.visible').forEach(menu => {
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
    const buscadorInput = document.getElementById('buscador-recuerdos');
    if (buscadorInput) {
        buscadorInput.addEventListener('input', (e) => {
            filtrarRecuerdos(e.target.value);
        });
    }
    
    // Buscador desplegable
    const btnSearchToggle = document.getElementById('btn-search-toggle-recuerdos');
    const searchExpandable = document.getElementById('search-expandable-recuerdos');
    const searchOverlay = document.getElementById('search-overlay-recuerdos');
    const btnLimpiarBusqueda = document.getElementById('btn-limpiar-busqueda');
    
    let searchExpanded = false;
    
    function closeSearch() {
        searchExpanded = false;
        if (searchExpandable) searchExpandable.classList.remove('active');
        if (searchOverlay) searchOverlay.classList.remove('active');
        if (buscadorInput) buscadorInput.value = '';
        filtrarRecuerdos('');
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
    
    await cargarRecuerdosDelBackend();
    mostrarRecuerdos();
    document.getElementById('btn-agregar-recuerdo').addEventListener('click', abrirFormularioAgregar);
    
    // Form submit para agregar recuerdo con imagen
    document.getElementById('form-recuerdo').addEventListener('submit', async (evento) => {
        evento.preventDefault();
        
        const formData = new FormData();
        const imagenInput = document.getElementById('recuerdo-imagen');
        const mensaje = document.getElementById('recuerdo-mensaje').value.trim();
        const fecha = document.getElementById('recuerdo-fecha').value;
        const dedicatoria = document.getElementById('recuerdo-dedicatoria').value.trim();
        const autor = document.querySelector('input[name="recuerdo-autor"]:checked')?.value || '';
        
        if (!imagenInput.files[0]) {
            alert('Por favor selecciona una imagen');
            return;
        }
        
        formData.append('imagen', imagenInput.files[0]);
        formData.append('mensaje', mensaje);
        formData.append('fecha', fecha);
        formData.append('dedicatoria', dedicatoria);
        formData.append('autor', autor);
        
        // Loader visual
        let loader = document.getElementById('loader-recuerdo');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loader-recuerdo';
            loader.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;font-size:2em;color:#4a2fa9;display:none;';
            loader.innerHTML = '<span>Guardando...</span>';
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
        document.querySelector('.btn-guardar').disabled = true;
        
        try {
            const res = await fetch(`${CONFIG.BACKEND_URL}/recuerdos/add`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                await cargarRecuerdosDelBackend();
                recuerdosEnPantalla = [...RECUERDOS];
                mostrarRecuerdos();
                cerrarModal();
            } else {
                alert('Error al guardar: ' + (data.error || 'desconocido'));
            }
        } catch (err) {
            alert('Error inesperado al guardar. Revisa consola.');
            console.error(err);
        }
        
        loader.style.display = 'none';
        document.querySelector('.btn-guardar').disabled = false;
    });
    
    document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarModal);
    document.getElementById('btn-cancelar').addEventListener('click', cerrarModal);
    document.getElementById('modal-recuerdo').addEventListener('click', (e) => {
        if (e.target.id === 'modal-recuerdo') {
            cerrarModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('modal-recuerdo').style.display === 'flex') {
            cerrarModal();
        }
    });
});
