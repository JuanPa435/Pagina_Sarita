// Mostrar la fecha actual en el footer
document.addEventListener('DOMContentLoaded', function() {
    const hoy = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormato = hoy.toLocaleDateString('es-ES', opciones);
    const fechaElement = document.getElementById('fecha');
    if (fechaElement) {
        fechaElement.textContent = fechaFormato;
    }

    // Efecto de aparición al hacer scroll
    observarElementos();
});

// Observar elementos y agregar animación al aparecer
function observarElementos() {
    const elementosAObservar = document.querySelectorAll(
        '.poema-card, .cancion-card, .galeria-item, .mensaje-box'
    );

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elementosAObservar.forEach(elemento => {
        elemento.style.opacity = '0';
        observador.observe(elemento);
    });
}

// Función para copiar un mensaje al portapapeles
function copiarAlPortapapeles(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        alert('¡Mensaje copiado! 💕');
    }).catch(err => {
        console.error('Error al copiar:', err);
    });
}

// Variable para controlar si ya hay confeti en progreso
let confetiBloqueado = true; // Comienza bloqueado hasta el primer clic válido
let ultimoClickConfeti = 0; // Timestamp del último clic
const COOLDOWN_CONFETI = 50000; // 50 segundos en milisegundos

// Efecto de confeti (opcional)
function lanzarConfeti() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particulas = [];

    class Particula {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * 5 + 2;
            this.speedY = Math.random() * 5 + 3;
            this.speedX = (Math.random() - 0.5) * 4;
            this.emoji = ['❤️', '💕', '💖', '✨', '🌹'][Math.floor(Math.random() * 5)];
        }

        actualizar() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.speedY += 0.1; // gravedad
        }

        dibujar() {
            ctx.font = `${this.size * 8}px Arial`;
            ctx.fillText(this.emoji, this.x, this.y);
        }
    }

    // Crear partículas gradualmente con delay
    let contadorParticulas = 0;
    const totalParticulas = 100;
    const delayPorParticula = 10; // milisegundos entre cada partícula

    function crearParticulasGradualmente() {
        if (contadorParticulas < totalParticulas) {
            particulas.push(new Particula());
            contadorParticulas++;
            setTimeout(crearParticulasGradualmente, delayPorParticula);
        }
    }

    // Iniciar creación gradual
    crearParticulasGradualmente();

    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particulas.length; i++) {
            particulas[i].actualizar();
            particulas[i].dibujar();

            // Eliminar partículas que salieron de pantalla
            if (particulas[i].y > canvas.height) {
                particulas.splice(i, 1);
            }
        }

        if (particulas.length > 0) {
            requestAnimationFrame(animar);
        } else {
            canvas.remove();
            // No resetear confetiBloqueado aquí - dejar que el cooldown lo controle
        }
    }

    animar();
}

// Sonido al hacer clic en corazones (opcional)
document.addEventListener('click', function(e) {
    if (e.target.textContent.includes('❤️') || 
        e.target.textContent.includes('💕') ||
        e.target.textContent.includes('💖')) {
        
        const ahora = Date.now();
        
        // Verificar si está dentro del cooldown (5 segundos)
        if (ahora - ultimoClickConfeti < COOLDOWN_CONFETI) {
            return; // Ignorar clic si aún está en cooldown
        }
        
        // Si llegamos aquí, es un clic válido
        ultimoClickConfeti = ahora; // Actualizar timestamp
        confetiBloqueado = true; // Bloquear inmediatamente
        lanzarConfeti();
    }
});

/* --------------------------------------------------
   Funcionalidad de subida de fotos para la galería
   - Valida código (0605)
   - Guarda imágenes en localStorage como base64
   - Permite descargar JSON con las imágenes guardadas
   - Integra las fotos guardadas con `GALERIA` (lectura en tiempo de ejecución)
-------------------------------------------------- */

const USER_GALERIA_KEY = 'galeria_user_images';

function getUserFotos() {
    try {
        const raw = localStorage.getItem(USER_GALERIA_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        console.error('Error leyendo user fotos desde localStorage', err);
        return [];
    }
}

function saveUserFotos(arr) {
    try {
        localStorage.setItem(USER_GALERIA_KEY, JSON.stringify(arr));
        fetch('http://localhost:3000/api/galeria/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ galeria: arr })
        }).catch(err => console.log('Backend no disponible:', err));
    } catch (err) {
        console.error('Error guardando user fotos en localStorage', err);
        alert('No se pudieron guardar las fotos en localStorage (espacio insuficiente).');
    }
}

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function handleUploadForm(event) {
    event.preventDefault();

    const codigo = document.getElementById('codigo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const inputFiles = document.getElementById('fotos');

    if (codigo !== '0605') {
        alert('Código incorrecto. No tienes permiso para subir fotos.');
        return;
    }

    if (!inputFiles || !inputFiles.files || inputFiles.files.length === 0) {
        alert('Selecciona al menos una foto.');
        return;
    }

    const archivos = Array.from(inputFiles.files);
    let fotosSubidas = 0;
    let errores = 0;

    for (const archivo of archivos) {
        // Tamaño máximo: 10MB
        if (archivo.size > 10 * 1024 * 1024) {
            alert(`La imagen "${archivo.name}" es demasiado grande (máx 10MB). Se omitirá.`);
            errores++;
            continue;
        }

        try {
            const dataUrl = await fileToDataURL(archivo);
            
            // Enviar al servidor
            const response = await fetch('/api/upload-foto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    codigo: codigo,
                    descripcion: descripcion || archivo.name,
                    imageData: dataUrl,
                    filename: archivo.name
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                fotosSubidas++;
                // También guardar en localStorage como respaldo
                const userFotos = getUserFotos();
                userFotos.push({
                    data: dataUrl,
                    descripcion: descripcion || archivo.name,
                    uploadedAt: new Date().toISOString(),
                    servidor: true
                });
                saveUserFotos(userFotos);
            } else {
                console.error('Error del servidor:', result.error);
                errores++;
            }
        } catch (err) {
            console.error('Error leyendo/subiendo archivo', archivo.name, err);
            errores++;
        }
    }

    // Limpiar formulario
    document.getElementById('upload-form').reset();

    if (fotosSubidas > 0) {
        alert(`✅ ${fotosSubidas} foto(s) subida(s) correctamente a la carpeta /fotos/subidas/`);
    }
    if (errores > 0) {
        alert(`⚠️ ${errores} foto(s) no se pudieron subir. Revisa la consola para más detalles.`);
    }
    
    // Cerrar modal
    const modal = document.getElementById('modal-upload');
    if (modal) {
        modal.classList.remove('visible');
        modal.classList.add('hidden');
    }
    
    // Volver a renderizar la galería
    if (typeof renderGallery === 'function') renderGallery();
}

function descargarJSON() {
    const fotos = getUserFotos();
    const blob = new Blob([JSON.stringify(fotos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'galeria_user_images.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// Inicializador público que la página puede llamar
function initGallery(options = {}) {
    const fotosPorPagina = options.fotosPorPagina || 6;
    const paginaInicial = options.paginaInicial || 1;

    // Estado compartido en window para facilitar accesos desde el HTML
    window._GALERIA_STATE = {
        fotosPorPagina,
        paginaActual: paginaInicial
    };

    const form = document.getElementById('upload-form');
    if (form) form.addEventListener('submit', handleUploadForm);

    // Inicializar modal
    initModalHandlers();

    // Render inicial
    renderGallery();
}

function initModalHandlers() {
    const modal = document.getElementById('modal-upload');
    const btnAbrir = document.getElementById('btn-subir-fotos');
    const btnCerrar = document.getElementById('modal-close');
    const btnCancelar = document.getElementById('modal-cancel');
    const btnDescarga = document.getElementById('descargar-json');
    const fileInput = document.getElementById('fotos');

    if (!modal || !btnAbrir) return;

    // Abrir modal
    btnAbrir.addEventListener('click', () => {
        modal.classList.add('visible');
        modal.classList.remove('hidden');
    });

    // Cerrar modal
    const cerrarModal = () => {
        modal.classList.remove('visible');
        modal.classList.add('hidden');
        document.getElementById('upload-form').reset();
    };

    btnCerrar.addEventListener('click', cerrarModal);
    btnCancelar.addEventListener('click', cerrarModal);

    // Descarga JSON (desde dentro del modal)
    if (btnDescarga) {
        btnDescarga.addEventListener('click', descargarJSON);
    }

    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });

    // Drag and drop
    if (fileInput) {
        const wrapper = fileInput.parentElement;
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            wrapper.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            wrapper.addEventListener(eventName, () => {
                wrapper.style.background = 'rgba(255, 105, 180, 0.2)';
                wrapper.style.borderColor = '#ff1493';
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            wrapper.addEventListener(eventName, () => {
                wrapper.style.background = 'rgba(255, 105, 180, 0.05)';
                wrapper.style.borderColor = '#ff69b4';
            });
        });

        wrapper.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileInput.files = files;
        });
    }
}

function renderGallery() {
    const state = window._GALERIA_STATE || { fotosPorPagina: 6, paginaActual: 1 };
    const container = document.getElementById('galeria-container');
    const paginacionDiv = document.getElementById('paginacion');
    if (!container || !paginacionDiv) return;

    container.innerHTML = '';

    const userFotos = getUserFotos();
    // Combinar fotos originales con las subidas por el usuario
    const combined = GALERIA.map(f => ({ src: f.ruta, descripcion: f.descripcion, isUser: false }))
        .concat(userFotos.map(u => ({ src: u.data, descripcion: u.descripcion || '', isUser: true })));

    const totalPaginas = Math.max(1, Math.ceil(combined.length / state.fotosPorPagina));
    if (state.paginaActual > totalPaginas) state.paginaActual = totalPaginas;

    const inicio = (state.paginaActual - 1) * state.fotosPorPagina;
    const fin = inicio + state.fotosPorPagina;
    const fotosEnPagina = combined.slice(inicio, fin);

    fotosEnPagina.forEach((foto, index) => {
        const div = document.createElement('div');
        div.className = 'galeria-item';
        div.style.animation = `fadeInUp 0.6s ease-out ${index * 0.08}s both`;

        // If it's a user image (base64) we render directly; else we use original ruta
        const src = foto.isUser ? foto.src : foto.src;
        const contenido = `
            <img src="${src}" alt="${foto.descripcion}" class="galeria-imagen" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="galeria-placeholder" style="display:none;"><span>Foto no encontrada</span></div>
            <p class="galeria-caption">${foto.descripcion}</p>
        `;

        div.innerHTML = contenido;
        container.appendChild(div);
    });

    // Render paginación
    paginacionDiv.innerHTML = '';

    const btnAnterior = document.createElement('button');
    btnAnterior.className = 'pagina-btn ' + (state.paginaActual === 1 ? 'deshabilitada' : '');
    btnAnterior.textContent = '← Anterior';
    btnAnterior.disabled = state.paginaActual === 1;
    btnAnterior.onclick = () => {
        if (state.paginaActual > 1) {
            state.paginaActual--;
            renderGallery();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    paginacionDiv.appendChild(btnAnterior);

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagina-btn ' + (i === state.paginaActual ? 'activa' : '');
        btn.textContent = i;
        btn.onclick = () => {
            state.paginaActual = i;
            renderGallery();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        paginacionDiv.appendChild(btn);
    }

    const btnSiguiente = document.createElement('button');
    btnSiguiente.className = 'pagina-btn ' + (state.paginaActual === totalPaginas ? 'deshabilitada' : '');
    btnSiguiente.textContent = 'Siguiente →';
    btnSiguiente.disabled = state.paginaActual === totalPaginas;
    btnSiguiente.onclick = () => {
        if (state.paginaActual < totalPaginas) {
            state.paginaActual++;
            renderGallery();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    paginacionDiv.appendChild(btnSiguiente);

    // Re-observar elementos para animaciones si la función está disponible
    if (typeof observarElementos === 'function') observarElementos();
}
