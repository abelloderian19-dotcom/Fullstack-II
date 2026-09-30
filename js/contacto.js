const formularioContacto = document.getElementById("contact-form");
const mensajeContacto = document.getElementById("contact-feedback");
const CLAVE_MENSAJES_CONTACTO = "pasteleria-mensajes-contacto";

const camposContacto = [
    {
        input: document.getElementById("contact-name"),
        error: document.getElementById("name-error"),
        validar(valor) {
            return esRequerido(valor) || largoMinimo(valor.trim(), 3) || largoMaximo(valor.trim(), 80);
        },
    },
    {
        input: document.getElementById("contact-email"),
        error: document.getElementById("email-error"),
        validar(valor, input) {
            return esRequerido(valor) || largoMaximo(valor.trim(), 120) ||
                (input.validity.typeMismatch ? "Ingresa un correo electrónico válido" : null);
        },
    },
    {
        input: document.getElementById("contact-message"),
        error: document.getElementById("message-error"),
        validar(valor) {
            return esRequerido(valor) || largoMinimo(valor.trim(), 10) || largoMaximo(valor.trim(), 1000);
        },
    },
];

camposContacto.forEach(({ input }) => {
    input.addEventListener("input", () => {
        input.removeAttribute("aria-invalid");
        document.getElementById(`${input.id.replace("contact-", "")}-error`).textContent = "";
        mensajeContacto.textContent = "";
        mensajeContacto.classList.remove("text-success");
        mensajeContacto.classList.add("text-danger");
    });
});

formularioContacto.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mensajeContacto.textContent = "";
    mensajeContacto.classList.remove("text-success");
    mensajeContacto.classList.add("text-danger");

    let primerCampoInvalido = null;
    camposContacto.forEach(({ input, error, validar }) => {
        const problema = validar(input.value, input);
        error.textContent = problema || "";
        input.setAttribute("aria-invalid", String(Boolean(problema)));
        if (problema && !primerCampoInvalido) primerCampoInvalido = input;
    });

    if (primerCampoInvalido) {
        primerCampoInvalido.focus();
        return;
    }

    const nuevoMensaje = {
        nombre: document.getElementById("contact-name").value.trim(),
        correo: document.getElementById("contact-email").value.trim(),
        mensaje: document.getElementById("contact-message").value.trim(),
        fecha: new Date().toISOString(),
    };

    try {
        const mensajesGuardados = JSON.parse(localStorage.getItem(CLAVE_MENSAJES_CONTACTO) || "[]");
        const listaMensajes = Array.isArray(mensajesGuardados) ? mensajesGuardados : [];
        listaMensajes.push(nuevoMensaje);
        localStorage.setItem(CLAVE_MENSAJES_CONTACTO, JSON.stringify(listaMensajes));
        formularioContacto.reset();
        mensajeContacto.textContent = "¡Gracias! Tu mensaje se envio correctamente.";
        mensajeContacto.classList.remove("text-danger");
        mensajeContacto.classList.add("text-success");
    } catch {
        mensajeContacto.textContent = "No se pudo enviar el mensaje en este navegador. Inténtalo nuevamente mas tarde.";
        mensajeContacto.classList.remove("text-success");
        mensajeContacto.classList.add("text-danger");
    }
});
