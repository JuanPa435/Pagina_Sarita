// JS para la página de recuerdos (galería de fotos)

const RECUERDOS_POR_PAGINA = 12;
let paginaActual = 1;
let recuerdoDatosEditando = null;
let recuerdosEnPantalla = [];
let RECUERDOS = [];
let cropperInstance = null;
let imagenOriginalFile = null;
let imagenEditadaBlob = null;

// Cargar recuerdos (fotos) desde el backend
async function cargarRecuerdosDelBackend() {
    try {
        const url = `${CONFIG.BACKEND_URL}/recuerdos/get`;
        console.log('🔍 Cargando recuerdos desde:', url);
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        console.log('📦 Respuesta del servidor:', data);
        
        if (data.success && Array.isArray(data.recuerdos)) {
            RECUERDOS = data.recuerdos.map(recuerdo => {
                // Construir la URL completa de la imagen correctamente
                let imageUrl;
                if (recuerdo.url.startsWith('http')) {
                    imageUrl = recuerdo.url;
                } else if (recuerdo.url.startsWith('/api/')) {
                    // Si ya tiene /api/, usar CONFIG.BACKEND_URL sin /api
                    const baseUrl = CONFIG.BACKEND_URL.replace('/api', '');
                    imageUrl = `${baseUrl}${recuerdo.url}`;
                } else {
                    // Si no tiene /api/, agregar la ruta completa
                    imageUrl = `${CONFIG.BACKEND_URL}${recuerdo.url}`;
                }
                
                console.log(`🖼️ Recuerdo ${recuerdo.id}: ${imageUrl}`);
                
                return {
                    id: recuerdo.id,
                    url: imageUrl + '?t=' + Date.now(),
                    mensaje: recuerdo.mensaje || '',
                    fecha: recuerdo.fecha || '',
                    dedicatoria: recuerdo.dedicatoria || '',
                    autor: recuerdo.autor || ''
                };
            });
            
            // Ordenar por fecha de más reciente a más antigua
            RECUERDOS.sort((a, b) => {
                if (!a.fecha && !b.fecha) return 0;
                if (!a.fecha) return 1;
                if (!b.fecha) return -1;
                return new Date(b.fecha) - new Date(a.fecha);
            });
            
            recuerdosEnPantalla = [...RECUERDOS];
            const cnt = document.getElementById('recuerdos-count');
            if (cnt) cnt.textContent = `(${RECUERDOS.length})`;
            console.log(`✅ ${RECUERDOS.length} recuerdos cargados y ordenados por fecha`);
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
        div.className = 'recuerdo-card-container';
        div.innerHTML = `
            <div class="recuerdo-card" onclick="voltearTarjeta(this)" data-recuerdo-id="${recuerdo.id}">
                <div class="recuerdo-card-inner">
                    <div class="recuerdo-card-front">
                        <img src="${recuerdo.url}" 
                             alt="Recuerdo ${indicePrincipal + 1}" 
                             class="recuerdo-imagen" 
                             loading="lazy"
                             onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22400%22 height=%22400%22/%3E%3Ctext fill=%22%23999%22 font-family=%22Arial%22 font-size=%2216%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImagen no disponible%3C/text%3E%3C/svg%3E';">
                        ${recuerdo.dedicatoria ? `<div class="recuerdo-mensaje-overlay">${recuerdo.dedicatoria}</div>` : ''}
                    </div>
                    <div class="recuerdo-card-back">
                        <div class="recuerdo-detalles">
                            ${recuerdo.fecha ? `
                                <div class="detalle-fecha">
                                    <p>${recuerdo.fecha}</p>
                                </div>
                            ` : ''}
                            ${recuerdo.mensaje ? `
                                <div class="detalle-mensaje">
                                    <p>${recuerdo.mensaje}</p>
                                </div>
                            ` : ''}
                            ${recuerdo.autor ? `
                                <div class="detalle-autor">
                                    <p>${recuerdo.autor}</p>
                                </div>
                            ` : ''}
                            ${!recuerdo.mensaje && !recuerdo.autor && !recuerdo.fecha ? `
                                <div class="detalle-vacio">
                                    <p>Sin detalles adicionales</p>
                                </div>
                            ` : ''}
                            <p class="detalle-instruccion">✨ Toca de nuevo para ver la foto ✨</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="botones-recuerdo-menu">
                <button class="btn-menu-toggle" onclick="event.stopPropagation(); toggleMenuRecuerdo(this)">⋮</button>
                <div class="botones-recuerdo-desplegable">
                    <button class="btn-editar" onclick="event.stopPropagation(); editarRecuerdo(${recuerdo.id})">✏️ Editar</button>
                    <button class="btn-eliminar" onclick="event.stopPropagation(); eliminarRecuerdo(${recuerdo.id})">🗑️ Eliminar</button>
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
    
    // Limpiar preview y estados de imagen
    const previewContainer = document.getElementById('preview-imagen-container');
    const previewImagen = document.getElementById('preview-imagen');
    const btnEditarImagen = document.getElementById('btn-editar-imagen');
    
    previewImagen.src = '';
    previewContainer.style.display = 'none';
    btnEditarImagen.style.display = 'none';
    
    imagenEditadaBlob = null;
    imagenOriginalFile = null;
    recuerdoDatosEditando = null;
}

function abrirFormularioAgregar() {
    recuerdoDatosEditando = null;
    document.getElementById('form-recuerdo').reset();
    document.getElementById('recuerdo-imagen').required = true;
    mostrarModal('Agregar Recuerdo');
}

function editarRecuerdo(id) {
    const recuerdo = RECUERDOS.find(r => r.id === id);
    if (!recuerdo) {
        alert('Recuerdo no encontrado');
        return;
    }
    
    recuerdoDatosEditando = recuerdo;
    
    // Cargar datos en el formulario
    document.getElementById('recuerdo-mensaje').value = recuerdo.mensaje || '';
    document.getElementById('recuerdo-fecha').value = recuerdo.fecha || '';
    document.getElementById('recuerdo-dedicatoria').value = recuerdo.dedicatoria || '';
    
    // Seleccionar autor
    const autorRadio = document.querySelector(`input[name="recuerdo-autor"][value="${recuerdo.autor}"]`);
    if (autorRadio) autorRadio.checked = true;
    
    // Imagen no es requerida en edición
    document.getElementById('recuerdo-imagen').required = false;
    
    // Cargar imagen actual en el preview para poder editarla
    const previewContainer = document.getElementById('preview-imagen-container');
    const previewImagen = document.getElementById('preview-imagen');
    const btnEditarImagen = document.getElementById('btn-editar-imagen');
    
    previewImagen.src = recuerdo.url + '?t=' + Date.now();
    previewContainer.style.display = 'block';
    btnEditarImagen.style.display = 'inline-block';
    btnEditarImagen.textContent = '✂️ Reencuadrar Imagen';
    
    // Marcar que estamos usando la imagen actual (no hay archivo nuevo)
    imagenOriginalFile = null;
    imagenEditadaBlob = null;
    
    mostrarModal('Editar Recuerdo');
}

// Funciones para el editor de imagen
function inicializarEditorImagen() {
    const inputImagen = document.getElementById('recuerdo-imagen');
    const btnEditarImagen = document.getElementById('btn-editar-imagen');
    const previewContainer = document.getElementById('preview-imagen-container');
    const previewImagen = document.getElementById('preview-imagen');
    
    inputImagen.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            imagenOriginalFile = file;
            imagenEditadaBlob = null;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                previewImagen.src = event.target.result;
                previewContainer.style.display = 'block';
                btnEditarImagen.style.display = 'inline-block';
                btnEditarImagen.textContent = '✂️ Ajustar Imagen';
            };
            reader.readAsDataURL(file);
        }
    });
    
    btnEditarImagen.addEventListener('click', function() {
        // Funciona tanto con archivo nuevo como con imagen actual
        if (previewImagen.src) {
            abrirEditorCrop();
        }
    });
}

function abrirEditorCrop() {
    const modalCrop = document.getElementById('modal-crop-imagen');
    const imagenCrop = document.getElementById('imagen-crop');
    const previewImagen = document.getElementById('preview-imagen');
    
    if (!previewImagen.src) {
        alert('No hay imagen para editar');
        return;
    }
    
    imagenCrop.src = previewImagen.src;
    modalCrop.style.display = 'flex';
    
    setTimeout(() => {
        if (cropperInstance) {
            cropperInstance.destroy();
        }
        
        cropperInstance = new Cropper(imagenCrop, {
            aspectRatio: NaN,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 0.9,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
            minContainerWidth: 200,
            minContainerHeight: 200,
        });
    }, 100);
}

function cerrarEditorCrop() {
    const modalCrop = document.getElementById('modal-crop-imagen');
    modalCrop.style.display = 'none';
    if (cropperInstance) {
        cropperInstance.destroy();
        cropperInstance = null;
    }
}

function aplicarCrop() {
    if (!cropperInstance) return;
    
    cropperInstance.getCroppedCanvas({
        maxWidth: 1920,
        maxHeight: 1920,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
    }).toBlob((blob) => {
        imagenEditadaBlob = blob;
        
        const previewImagen = document.getElementById('preview-imagen');
        previewImagen.src = URL.createObjectURL(blob);
        
        cerrarEditorCrop();
    }, 'image/jpeg', 0.9);
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

function voltearTarjeta(card) {
    card.classList.toggle('volteada');
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
        // Inicializar editor de imagen
        inicializarEditorImagen();
    
        // Controles del editor de crop
        document.getElementById('btn-zoom-in').addEventListener('click', () => {
            if (cropperInstance) cropperInstance.zoom(0.1);
        });
    
        document.getElementById('btn-zoom-out').addEventListener('click', () => {
            if (cropperInstance) cropperInstance.zoom(-0.1);
        });
    
        document.getElementById('btn-rotate-left').addEventListener('click', () => {
            if (cropperInstance) cropperInstance.rotate(-45);
        });
    
        document.getElementById('btn-rotate-right').addEventListener('click', () => {
            if (cropperInstance) cropperInstance.rotate(45);
        });
    
        document.getElementById('btn-reset-crop').addEventListener('click', () => {
            if (cropperInstance) cropperInstance.reset();
        });
    
        document.getElementById('btn-aplicar-crop').addEventListener('click', aplicarCrop);
        document.getElementById('btn-cancelar-crop').addEventListener('click', cerrarEditorCrop);
        document.getElementById('btn-cerrar-crop').addEventListener('click', cerrarEditorCrop);
    
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
    
    // Form submit para agregar/editar recuerdo con imagen
    document.getElementById('form-recuerdo').addEventListener('submit', async (evento) => {
        evento.preventDefault();
        
        const formData = new FormData();
        const imagenInput = document.getElementById('recuerdo-imagen');
        // Usar imagen editada si existe, sino la original
        const imagenParaSubir = imagenEditadaBlob || imagenInput.files[0];
        
        const mensaje = document.getElementById('recuerdo-mensaje').value.trim();
        const fecha = document.getElementById('recuerdo-fecha').value;
        const dedicatoria = document.getElementById('recuerdo-dedicatoria').value.trim();
        const autor = document.querySelector('input[name="recuerdo-autor"]:checked')?.value || '';
        
        // Si estamos editando
        if (recuerdoDatosEditando) {
            // Solo agregar imagen si se seleccionó/editó una nueva
            if (imagenParaSubir) {
                formData.append('imagen', imagenParaSubir, 'recuerdo.jpg');
            }
            
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
                loader.innerHTML = '<span>Actualizando...</span>';
                document.body.appendChild(loader);
            } else {
                loader.innerHTML = '<span>Actualizando...</span>';
            }
            loader.style.display = 'flex';
            document.querySelector('.btn-guardar').disabled = true;
            
            try {
                const res = await fetch(`${CONFIG.BACKEND_URL}/recuerdos/update/${recuerdoDatosEditando.id}`, {
                    method: 'PUT',
                    body: formData
                });
                const data = await res.json();
                if (data.success) {
                    // Limpiar blobs y estados
                    imagenEditadaBlob = null;
                    imagenOriginalFile = null;
                    await cargarRecuerdosDelBackend();
                    recuerdosEnPantalla = [...RECUERDOS];
                    mostrarRecuerdos();
                    cerrarModal();
                } else {
                    alert('Error al actualizar: ' + (data.error || 'desconocido'));
                }
            } catch (err) {
                alert('Error inesperado al actualizar. Revisa consola.');
                console.error(err);
            }
            
            loader.style.display = 'none';
            document.querySelector('.btn-guardar').disabled = false;
        } else {
            // Crear nuevo recuerdo
            if (!imagenParaSubir) {
                alert('Por favor selecciona una imagen');
                return;
            }
            
            formData.append('imagen', imagenParaSubir, 'recuerdo.jpg');
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
        }
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
