const formularioLogin = document.getElementById("login-form");
const correoLogin = document.getElementById("login-email");
const passwordLogin = document.getElementById("login-password");
const feedbackLogin = document.getElementById("login-feedback");

formularioLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();
    feedbackLogin.textContent = "";
    feedbackLogin.classList.remove("login-feedback-error");

    const correo = correoLogin.value.trim().toLowerCase();
    const password = passwordLogin.value;

    if (!correo || !password) {
        mostrarErrorLogin("Ingresa tu correo y contraseña.");
        return;
    }

    if (!correoLogin.validity.valid) {
        mostrarErrorLogin("Ingresa un correo electrónico válido.");
        correoLogin.focus();
        return;
    }

    let listaUsuarios;
    try {
        listaUsuarios = typeof obtenerUsuarios === "function" ? obtenerUsuarios() : usuarios;
    } catch {
        listaUsuarios = usuarios;
    }

    if (!Array.isArray(listaUsuarios)) listaUsuarios = usuarios;

    const usuarioEncontrado = listaUsuarios.find((usuario) =>
        usuario.correo.trim().toLowerCase() === correo && usuario.password === password
    );

    if (!usuarioEncontrado) {
        mostrarErrorLogin("Correo o contraseña incorrectos.");
        passwordLogin.value = "";
        passwordLogin.focus();
        return;
    }

    const usuarioSesion = {
        run: usuarioEncontrado.run,
        nombre: usuarioEncontrado.nombre,
        apellidos: usuarioEncontrado.apellidos,
        correo: usuarioEncontrado.correo,
        tipoUsuario: usuarioEncontrado.tipoUsuario,
    };

    try {
        sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioSesion));
    } catch {
        mostrarErrorLogin("No se pudo iniciar la sesión en este navegador.");
        return;
    }

    if (usuarioEncontrado.tipoUsuario === "Administrador") {
        window.location.href = "./admin/index.html";
    } else if (usuarioEncontrado.tipoUsuario === "Vendedor") {
        window.location.href = "./productos.html";
    } else {
        window.location.href = "./index.html";
    }
});

function mostrarErrorLogin(mensaje) {
    feedbackLogin.textContent = mensaje;
    feedbackLogin.classList.add("login-feedback-error");
}
