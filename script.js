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
