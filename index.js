// Cargar datos desde el backend PostgreSQL
async function cargarDatos() {
    const BACKEND_URL = CONFIG.BACKEND_URL;

    // Cargar poemas desde backend
    try {
        console.log('🔄 Cargando poemas del backend...');
        const res = await fetch(`${BACKEND_URL}/poemas/get`);
        const data = await res.json();
        if (data.success && data.poemas) {
            console.log(`✅ ${data.poemas.length} poemas cargados`);
            mostrarPreviewPoemas(data.poemas.slice(0, 3));
        } else {
            console.warn('⚠️ No hay poemas disponibles');
            mostrarPreviewPoemas([]);
        }
    } catch (err) {
        console.error('❌ Error cargando poemas:', err);
        cargarPoemasDefecto();
    }

    // Cargar canciones desde backend
    try {
        console.log('🔄 Cargando canciones del backend...');
        const res = await fetch(`${BACKEND_URL}/canciones/get`);
        const data = await res.json();
        if (data.success && data.canciones) {
            console.log(`✅ ${data.canciones.length} canciones cargadas`);
            mostrarPreviewCanciones(data.canciones.slice(0, 3));
        } else {
            console.warn('⚠️ No hay canciones disponibles');
            mostrarPreviewCanciones([]);
        }
    } catch (err) {
        console.error('❌ Error cargando canciones:', err);
        cargarCancionesDefecto();
    }

    // Cargar mensajes desde backend
    try {
        console.log('🔄 Cargando mensajes del backend...');
        const res = await fetch(`${BACKEND_URL}/mensajes/get`);
        const data = await res.json();
        if (data.success && data.mensajes) {
            console.log(`✅ ${data.mensajes.length} mensajes cargados`);
            mostrarPreviewMensajes(data.mensajes.slice(0, 3));
        } else {
            console.warn('⚠️ No hay mensajes disponibles');
            mostrarPreviewMensajes([]);
        }
    } catch (err) {
        console.error('❌ Error cargando mensajes:', err);
        cargarMensajesDefecto();
    }

    // Fotos y meses siguen usando localStorage por ahora
    const fotosGuardadas = localStorage.getItem('fotos_app');
    const mesesGuardados = localStorage.getItem('meses_app');

    if (fotosGuardadas) {
        try {
            const fotos = JSON.parse(fotosGuardadas);
            mostrarPreviewFotos(fotos.slice(0, 6));
        } catch (e) {
            console.log('Error cargando fotos');
        }
    }

    if (mesesGuardados) {
        try {
            const meses = JSON.parse(mesesGuardados);
            mostrarPreviewMeses(meses);
        } catch (e) {
            console.log('Error cargando meses');
        }
    }

    // Actualizar fecha
    const hoy = new Date();
    document.getElementById('fecha').textContent = hoy.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Cargar poemas desde el archivo de datos
function cargarPoemasDefecto() {
    const poemasScript = document.createElement('script');
    poemasScript.src = 'paginas/poemas/poemas-data.js';
    poemasScript.onload = () => {
        if (typeof POEMAS !== 'undefined') {
            mostrarPreviewPoemas(POEMAS.slice(0, 3));
        }
    };
    document.head.appendChild(poemasScript);
}

// Cargar canciones desde el archivo de datos
function cargarCancionesDefecto() {
    const cancionesScript = document.createElement('script');
    cancionesScript.src = 'paginas/canciones/canciones-data.js';
    cancionesScript.onload = () => {
        if (typeof CANCIONES !== 'undefined') {
            mostrarPreviewCanciones(CANCIONES.slice(0, 3));
        }
    };
    document.head.appendChild(cancionesScript);
}

// Cargar mensajes desde el archivo de datos
function cargarMensajesDefecto() {
    const mensajesScript = document.createElement('script');
    mensajesScript.src = 'mensajes/mensajes-data.js';
    mensajesScript.onload = () => {
        if (typeof MENSAJES !== 'undefined') {
            mostrarPreviewMensajes(MENSAJES.slice(0, 3));
        }
    };
    document.head.appendChild(mensajesScript);
}

function mostrarPreviewPoemas(poemas) {
    const container = document.getElementById('poemasPreview');
    container.innerHTML = '';
    
    if (poemas.length === 0) {
        container.innerHTML = '<p class="no-data">Aún no hay poemas. ¡Crea uno!</p>';
        return;
    }
    
    poemas.forEach(poema => {
        const div = document.createElement('div');
        div.className = 'item-preview';
        const contenidoTruncado = poema.contenido.substring(0, 120).replace(/\n/g, ' ');
        div.innerHTML = `
            <h3>📝 ${poema.titulo}</h3>
            <p class="preview-text">"${contenidoTruncado}${poema.contenido.length > 120 ? '...' : ''}"</p>
            <span class="autor">— ${poema.autor || 'Escrito con amor ❤️'}</span>
        `;
        container.appendChild(div);
    });
}

function mostrarPreviewCanciones(canciones) {
    const container = document.getElementById('cancionesPreview');
    container.innerHTML = '';
    
    if (canciones.length === 0) {
        container.innerHTML = '<p class="no-data">Aún no hay canciones. ¡Agrega una!</p>';
        return;
    }
    
    canciones.forEach(cancion => {
        const div = document.createElement('div');
        div.className = 'item-preview';
        const razonTruncada = cancion.razon ? cancion.razon.substring(0, 100) : 'Sin descripción';
        div.innerHTML = `
            <h3>🎵 ${cancion.titulo}</h3>
            <p class="preview-text-artist">${cancion.artista || 'Artista desconocido'}</p>
            <p class="preview-text-small">"${razonTruncada}${cancion.razon && cancion.razon.length > 100 ? '...' : ''}"</p>
        `;
        container.appendChild(div);
    });
}

function mostrarPreviewMensajes(mensajes) {
    const container = document.getElementById('mensajesPreview');
    container.innerHTML = '';
    
    if (mensajes.length === 0) {
        container.innerHTML = '<p class="no-data">Aún no hay mensajes. ¡Crea uno!</p>';
        return;
    }
    
    mensajes.forEach(mensaje => {
        const div = document.createElement('div');
        div.className = 'item-preview';
        const contenidoTruncado = (mensaje.contenido || mensaje.texto || '').substring(0, 120);
        div.innerHTML = `
            <h3>💬 ${mensaje.asunto || 'Mensaje Especial'}</h3>
            <p class="preview-text">"${contenidoTruncado}${contenidoTruncado.length > 0 && (mensaje.contenido || mensaje.texto).length > 120 ? '...' : ''}"</p>
            <span class="fecha-mensaje">${mensaje.fecha || formatearFecha(new Date().toISOString())}</span>
        `;
        container.appendChild(div);
    });
}

function mostrarPreviewFotos(fotos) {
    const container = document.getElementById('galeriaPreview');
    container.innerHTML = '';
    
    if (fotos.length === 0) {
        container.innerHTML = '<p class="no-data">Aún no hay fotos. ¡Sube una!</p>';
        return;
    }
    
    fotos.forEach(foto => {
        const div = document.createElement('div');
        div.className = 'foto-preview';
        div.innerHTML = `<img src="${foto.url}" alt="Foto" onerror="this.src='https://via.placeholder.com/150?text=Error'">`;
        container.appendChild(div);
    });
}

function mostrarPreviewMeses(meses) {
    const container = document.getElementById('mesesPreview');
    container.innerHTML = '';
    
    if (meses.length === 0) {
        container.innerHTML = '<p class="no-data">Aún no hay celebraciones mensuales. ¡Registra una!</p>';
        return;
    }
    
    meses.sort((a, b) => b.numero - a.numero).slice(0, 6).forEach(mes => {
        const div = document.createElement('div');
        div.className = 'mes-preview';
        div.innerHTML = `
            <div class="mes-numero">Mes ${mes.numero}</div>
            <p class="mes-fecha">${formatearFecha(mes.fecha)}</p>
            <p class="mes-texto">${mes.mensaje?.substring(0, 50) || 'Sin mensaje'}...</p>
        `;
        container.appendChild(div);
    });
}

function formatearFecha(fecha) {
    if (!fecha) return 'Sin fecha';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' });
}

// Calcular días juntos
function calcularDiasJuntos() {
    // Cambia esta fecha a tu fecha de inicio
    const fechaInicio = new Date('2024-01-01');
    const hoy = new Date();
    const diferencia = hoy - fechaInicio;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    document.getElementById('contador-dias').textContent = dias;
}

// Modal de mes
const modalMes = document.getElementById('modal-mes');
const btnAgregarMes = document.getElementById('btn-agregar-mes');
const btnCerrarMes = document.getElementById('btn-cerrar-mes');
const btnCancelarMes = document.getElementById('btn-cancelar-mes');
const formMes = document.getElementById('form-mes');

function abrirModalMes() {
    modalMes.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function cerrarModalMes() {
    modalMes.style.display = 'none';
    document.body.style.overflow = 'auto';
    formMes.reset();
}

btnAgregarMes.addEventListener('click', abrirModalMes);
btnCerrarMes.addEventListener('click', cerrarModalMes);
btnCancelarMes.addEventListener('click', cerrarModalMes);

// Cerrar modal al hacer clic fuera
modalMes.addEventListener('click', (e) => {
    if (e.target.id === 'modal-mes') {
        cerrarModalMes();
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalMes.style.display === 'flex') {
        cerrarModalMes();
    }
});

formMes.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const numero = document.getElementById('mes-numero').value;
    const fecha = document.getElementById('mes-fecha').value;
    const mensaje = document.getElementById('mes-mensaje').value.trim();

    if (!numero || !fecha || !mensaje) {
        alert('Por favor completa todos los campos');
        return;
    }

    let meses = JSON.parse(localStorage.getItem('meses_app') || '[]');
    
    // Verificar si el mes ya existe
    const mesExistente = meses.findIndex(m => m.numero === parseInt(numero));
    if (mesExistente !== -1) {
        meses[mesExistente] = { numero: parseInt(numero), fecha, mensaje };
    } else {
        meses.push({ numero: parseInt(numero), fecha, mensaje });
    }

    localStorage.setItem('meses_app', JSON.stringify(meses));
    cargarDatos();
    cerrarModalMes();
    alert('¡Mes registrado exitosamente! ❤️');
});

// Scroll suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    calcularDiasJuntos();
    cargarDatos();
});

// Recargar datos cada vez que se vuelve a la pestaña
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        cargarDatos();
    }
});
