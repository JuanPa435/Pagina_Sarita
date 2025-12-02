const POEMAS_POR_PAGINA = 12;
        let paginaActual = 1;
        let poemaDatosEditando = null;
        let poemasEnPantalla = []; // Array para filtros
        let POEMAS = []; // Array principal de poemas

        // Cargar poemas desde el backend
        async function cargarPoemasDelBackend() {
            try {
                const res = await fetch(`${CONFIG.BACKEND_URL}/poemas/get`, { cache: 'no-store' });
                const data = await res.json();
                console.log('📦 Respuesta poemas:', data);
                
                if (data.success && Array.isArray(data.poemas)) {
                    POEMAS = data.poemas;
                    poemasEnPantalla = [...POEMAS];
                    const cnt = document.getElementById('poemas-count');
                    if (cnt) cnt.textContent = `(${POEMAS.length})`;
                    console.log(`✅ ${POEMAS.length} poemas cargados`);
                    return true;
                }
            } catch (err) {
                console.error('❌ Error al cargar poemas:', err);
            }
            return false;
        }

        // Guardar poemas en el backend
        async function guardarPoemasEnBackend() {
            try {
                const res = await fetch(`${CONFIG.BACKEND_URL}/poemas/save`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ poemas: POEMAS })
                });
                const data = await res.json();
                if (data.success) {
                    console.log(`✅ Guardado exitoso`);
                    return true;
                } else {
                    console.error(`❌ Error al guardar:`, data.error);
                    return false;
                }
            } catch (err) {
                console.error('❌ Error guardando:', err);
                return false;
            }
        }

        // Función de búsqueda
        function filtrarPoemas(texto) {
            texto = texto.toLowerCase().trim();
            
            if (texto === '') {
                poemasEnPantalla = [...POEMAS];
            } else {
                poemasEnPantalla = POEMAS.filter(poema => 
                    poema.titulo.toLowerCase().includes(texto) ||
                    poema.contenido.toLowerCase().includes(texto) ||
                    poema.autor.toLowerCase().includes(texto)
                );
            }
            
            paginaActual = 1;
            mostrarPoemas();
        }

        function mostrarPoemas() {
            const container = document.getElementById('poemas-container');
            if (!container) return;
            
            container.innerHTML = '';
            const cnt = document.getElementById('poemas-count');
            if (cnt) cnt.textContent = `(${poemasEnPantalla.length})`;

            const inicio = (paginaActual - 1) * POEMAS_POR_PAGINA;
            const fin = inicio + POEMAS_POR_PAGINA;
            const poemasEnPagina = poemasEnPantalla.slice(inicio, fin);

            if (poemasEnPagina.length === 0) {
                const msg = poemasEnPantalla.length === 0 
                    ? '😔 No se encontraron poemas con tu búsqueda...' 
                    : 'Aún no hay poemas... pero aquí escribiré nuestras historias 🌹';
                container.innerHTML = `<div class="no-items">${msg}</div>`;
                actualizarPaginacion();
                return;
            }

            poemasEnPagina.forEach((poema, index) => {
                const indicePrincipal = inicio + index;
                const div = document.createElement('div');
                div.className = 'poema-card';
                div.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
                div.innerHTML = `
                    <h3>Poema #${indicePrincipal + 1}: ${poema.titulo}</h3>
                    <div class="poema-contenido">
                        <p>${poema.contenido}</p>
                    </div>
                    <span class="fecha">— ${poema.autor || 'Escrito con amor ❤️'}</span>
                    <div class="botones-poema-menu">
                        <button class="btn-menu-toggle" onclick="toggleMenuPoema(this)">+</button>
                        <div class="botones-poema-desplegable">
                            <button class="btn-editar" onclick="editarPoema(${indicePrincipal})">✎ Editar</button>
                            <button class="btn-eliminar" onclick="eliminarPoema(${indicePrincipal})">🗑️ Eliminar</button>
                        </div>
                    </div>
                `;
                container.appendChild(div);
            });

            actualizarPaginacion();
        }

        function actualizarPaginacion() {
            const totalPaginas = Math.ceil(poemasEnPantalla.length / POEMAS_POR_PAGINA);
            const paginacionDiv = document.getElementById('paginacion');
            paginacionDiv.innerHTML = '';

            // Botón anterior
            const btnAnterior = document.createElement('button');
            btnAnterior.className = 'pagina-btn ' + (paginaActual === 1 ? 'deshabilitada' : '');
            btnAnterior.textContent = '← Anterior';
            btnAnterior.disabled = paginaActual === 1;
            btnAnterior.onclick = () => {
                if (paginaActual > 1) {
                    paginaActual--;
                    mostrarPoemas();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            };
            paginacionDiv.appendChild(btnAnterior);

            // Números de página
            for (let i = 1; i <= totalPaginas; i++) {
                const btn = document.createElement('button');
                btn.className = 'pagina-btn ' + (i === paginaActual ? 'activa' : '');
                btn.textContent = i;
                btn.onclick = () => {
                    paginaActual = i;
                    mostrarPoemas();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };
                paginacionDiv.appendChild(btn);
            }

            // Botón siguiente
            const btnSiguiente = document.createElement('button');
            btnSiguiente.className = 'pagina-btn ' + (paginaActual === totalPaginas ? 'deshabilitada' : '');
            btnSiguiente.textContent = 'Siguiente →';
            btnSiguiente.disabled = paginaActual === totalPaginas;
            btnSiguiente.onclick = () => {
                if (paginaActual < totalPaginas) {
                    paginaActual++;
                    mostrarPoemas();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            };
            paginacionDiv.appendChild(btnSiguiente);
        }

        // Modal Functions
        function mostrarModal(titulo = 'Agregar Poema') {
            document.getElementById('modal-titulo').textContent = titulo;
            document.getElementById('modal-poema').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function cerrarModal() {
            document.getElementById('modal-poema').style.display = 'none';
            document.body.style.overflow = 'auto';
            document.getElementById('form-poema').reset();
            poemaDatosEditando = null;
        }

        // Agregar poema
        function abrirFormularioAgregar() {
            poemaDatosEditando = null;
            document.getElementById('form-poema').reset();
            mostrarModal('Agregar Poema');
        }

        // Editar poema
        function editarPoema(indice) {
            if (!POEMAS[indice]) {
                alert('Error: Poema no encontrado');
                return;
            }
            poemaDatosEditando = indice;
            const poema = POEMAS[indice];
            document.getElementById('poema-titulo').value = poema.titulo;
            document.getElementById('poema-contenido').value = poema.contenido;
            document.getElementById('poema-autor').value = poema.autor || '';
            mostrarModal('Editar Poema');
        }

        // Eliminar poema
        async function eliminarPoema(indice) {
            if (!POEMAS[indice]) {
                alert('Error: Poema no encontrado');
                return;
            }
            const titulo = POEMAS[indice].titulo;
            showConfirm(`¿Seguro que quieres eliminar el poema "${titulo}"?`, async () => {
                // Loader visual
                let loader = document.getElementById('loader-poema');
                if (!loader) {
                    loader = document.createElement('div');
                    loader.id = 'loader-poema';
                    loader.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;font-size:2em;color:#4a2fa9;display:none;';
                    loader.innerHTML = '<span>Eliminando...</span>';
                    document.body.appendChild(loader);
                } else {
                    loader.innerHTML = '<span>Eliminando...</span>';
                }
                loader.style.display = 'flex';
                POEMAS.splice(indice, 1);
                poemasEnPantalla = [...POEMAS];
                mostrarPoemas();
                try {
                    await guardarPoemasEnBackend();
                } catch (err) {
                    alert('Error inesperado al eliminar. Revisa consola.');
                }
                loader.style.display = 'none';
            }, () => {/* cancel noop */});
        }

        // Toggle menu de acciones en poema
        function toggleMenuPoema(btn) {
            const menu = btn.parentElement.querySelector('.botones-poema-desplegable');
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

        // Cerrar menú al hacer clic en otra parte
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.botones-poema-menu')) {
                document.querySelectorAll('.botones-poema-desplegable.visible').forEach(menu => {
                    menu.classList.remove('visible');
                    menu.previousElementSibling.classList.remove('activo');
                });
            }
        });

        // Guardar poema (agregar o editar)
        async function guardarPoema(evento) {
            evento.preventDefault();
            
            const titulo = document.getElementById('poema-titulo').value.trim();
            const contenido = document.getElementById('poema-contenido').value.trim();
            const autor = document.getElementById('poema-autor').value.trim();

            if (!titulo || !contenido) {
                alert('Por favor completa el título y contenido del poema');
                return;
            }

            const nuevoPoema = { titulo, contenido, autor: autor || 'Escrito con amor ❤️' };
            
            if (poemaDatosEditando !== null) {
                POEMAS[poemaDatosEditando] = nuevoPoema;
            } else {
                POEMAS.push(nuevoPoema);
            }
            
            // Guardar en backend
            const guardado = await guardarPoemasEnBackend();
            if (guardado) {
                poemaDatosEditando = null;
                cerrarModal();
                window.location.reload();
            } else {
                alert('Error al guardar. Intenta de nuevo.');
            }
        }

        document.addEventListener('DOMContentLoaded', async () => {
                        // Navbar toggle FIRST (so backend errors don't block it)
                        const navToggle = document.querySelector('.nav-toggle');
                        const navMenu = document.getElementById('menu-simple');
                        if (navToggle && navMenu) {
                            navToggle.addEventListener('click', function(e) {
                                e.stopPropagation();
                                const abierto = navMenu.classList.toggle('open');
                                navToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
                            });
                            // Close on link click
                            navMenu.querySelectorAll('a').forEach(function(link) {
                                link.addEventListener('click', function() {
                                    navMenu.classList.remove('open');
                                    navToggle.setAttribute('aria-expanded', 'false');
                                });
                            });
                            // Close on outside click
                            document.addEventListener('click', function(e) {
                                if (!e.target.closest('.navbar-simple')) {
                                    navMenu.classList.remove('open');
                                    navToggle.setAttribute('aria-expanded', 'false');
                                }
                            });
                        }

                        // Modal robust event delegation
                        document.getElementById('modal-poema').addEventListener('click', function(e) {
                            if (
                                e.target.id === 'btn-cerrar-modal' ||
                                e.target.id === 'btn-cancelar' ||
                                e.target.id === 'modal-poema'
                            ) {
                                cerrarModal();
                            }
                        });

                        // Cerrar modal con tecla Escape
                        document.addEventListener('keydown', (e) => {
                            const modal = document.getElementById('modal-poema');
                            if (e.key === 'Escape' && modal.style.display === 'flex') {
                                cerrarModal();
                            }
                        });

                        document.getElementById('form-poema').addEventListener('submit', guardarPoema);
            try {
                await cargarPoemasDelBackend();
            } catch (e) {
                console.error('Error cargando poemas:', e);
            }
            try {
                mostrarPoemas();
            } catch (e) {
                console.error('Error mostrando poemas:', e);
            }

            // Botón agregar
            document.getElementById('btn-agregar-poema').addEventListener('click', abrirFormularioAgregar);

            // Buscador expandible
            const btnSearchToggle = document.getElementById('btn-search-toggle-poemas');
            const searchExpandable = document.getElementById('search-expandable-poemas');
            const searchOverlay = document.getElementById('search-overlay-poemas');
            const buscadorInput = document.getElementById('buscador-poemas');
            const btnLimpiar = document.getElementById('btn-limpiar-busqueda');
            
            let searchExpanded = false;
            
            function closeSearch() {
                searchExpanded = false;
                searchExpandable.classList.remove('active');
                searchOverlay.classList.remove('active');
                buscadorInput.value = '';
                filtrarPoemas('');
                document.body.style.overflow = '';
            }
            
            btnSearchToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                searchExpanded = !searchExpanded;
                if (searchExpanded) {
                    searchExpandable.classList.add('active');
                    if (window.innerWidth <= 480) {
                        searchOverlay.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                    setTimeout(() => buscadorInput.focus(), 300);
                } else {
                    closeSearch();
                }
            });
            
            // Cerrar al hacer clic en overlay
            searchOverlay.addEventListener('click', closeSearch);
            
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
            
            buscadorInput.addEventListener('input', (e) => {
                filtrarPoemas(e.target.value);
            });
            
            // Botón limpiar (X)
            if (btnLimpiar) {
                btnLimpiar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeSearch();
                });
            }

            // Navbar toggle block moved to top
        });

        async function guardarPoema(evento) {
    evento.preventDefault();
    const titulo = document.getElementById('poema-titulo').value.trim();
    const contenido = document.getElementById('poema-contenido').value.trim();
    const autor = document.getElementById('poema-autor').value.trim();

    if (!titulo || !contenido) {
        alert('Por favor completa el título y contenido del poema');
        return;
    }

    // Loader visual
    let loader = document.getElementById('loader-poema');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loader-poema';
        loader.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;font-size:2em;color:#4a2fa9;display:none;';
        loader.innerHTML = '<span>Guardando...</span>';
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
    document.querySelector('.btn-guardar').disabled = true;

    const nuevoPoema = { titulo, contenido, autor: autor || 'Escrito con amor ❤️' };
    if (poemaDatosEditando !== null) {
        POEMAS[poemaDatosEditando] = nuevoPoema;
    } else {
        POEMAS.push(nuevoPoema);
    }
    poemasEnPantalla = [...POEMAS];
    mostrarPoemas();
    // Guardar en backend
    try {
        await guardarPoemasEnBackend();
    } catch (err) {
        alert('Error inesperado al guardar. Revisa consola.');
    }
    loader.style.display = 'none';
    document.querySelector('.btn-guardar').disabled = false;
    poemaDatosEditando = null;
    cerrarModal();
}