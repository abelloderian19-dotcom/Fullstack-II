// Formulario de usuario para crear y editar
// Si la URL tiene ?run=XXX se carga el usuario con ese RUN y queda en modo edición

const formulario = document.getElementById("form-usuario");
const selectTipoUsuario = document.getElementById("tipoUsuario");
const selectRegion = document.getElementById("region");
const selectComuna = document.getElementById("comuna");

const parametros = new URLSearchParams(window.location.search);
const runEditar = parametros.get("run");

const listaUsuarios = obtenerUsuarios();

// Marcar campo como inválido y mostrando mensaje, usando las clases de Bootstrap
function marcarError(input, mensaje) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    const feedback = input.parentElement.querySelector(".invalid-feedback");
    feedback.textContent = mensaje;
}

// Marca campo como valido, usando las clases de Bootstrap
function marcarValido(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
}

// Validacion de cada campo según su id 
// Devuelve true si es válido, false si no lo es
function validarCampo(input) {
    const valor = input.value.trim();
    let mensaje = null;

    switch (input.id) {
        case "run":
            // Requerido, sin puntos ni guion, entre 7 y 9 caracteres, dígito verificador correcto
            mensaje = esRequerido(valor) || largoMinimo(valor, 7) || largoMaximo(valor, 9) || validarRun(valor);
            break;

        case "nombre":
            // Requerido, máximo 50
            mensaje = esRequerido(valor) || largoMaximo(valor, 50);
            break;

        case "apellidos":
            // Requerido, máximo 100
            mensaje = esRequerido(valor) || largoMaximo(valor, 100);
            break;

        case "correo":
            // Requerido, máximo 100, solo dominios permitidos
            mensaje = esRequerido(valor) || largoMaximo(valor, 100) || dominioPermitido(valor);
            break;

        case "password":
            // Requerida, entre 4 y 10 caracteres (misma regla del login)
            mensaje = esRequerido(valor) || largoMinimo(valor, 4) || largoMaximo(valor, 10);
            break;

        case "fechaNacimiento":
            // Opcional, sin reglas
            break;

        case "tipoUsuario":
        case "region":
        case "comuna":
            // Selects requeridos
            mensaje = esRequerido(valor);
            break;

        case "direccion":
            // Requerida, máximo 300
            mensaje = esRequerido(valor) || largoMaximo(valor, 300);
            break;
    }

    if (mensaje) {
        marcarError(input, mensaje);
        return false;
    }

    marcarValido(input);
    return true;
}

// Valida todos los campos. Devuelve true solo si todos son válidos
// y false si no lo es
function validarFormulario() {
    const ids = ["run", "nombre", "apellidos", "correo", "password", "fechaNacimiento", "tipoUsuario", "region", "comuna", "direccion"];
    let valido = true;

    ids.forEach((id) => {
        const input = document.getElementById(id);
        if (!validarCampo(input)) valido = false;
    });

    return valido;
}

// Llena los selects de tipo de usuario y region desde los arreglos de datos
tiposUsuario.forEach((tipo) => {
    const opcion = document.createElement("option");
    opcion.value = tipo;
    opcion.textContent = tipo;
    selectTipoUsuario.appendChild(opcion);
});

regiones.forEach((region) => {
    const opcion = document.createElement("option");
    opcion.value = region.nombre;
    opcion.textContent = region.nombre;
    selectRegion.appendChild(opcion);
});

// Vacía el select de comunas y lo llena con las comunas de la región indicada
function cargarComunas(nombreRegion) {
    selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';

    const region = regiones.find((r) => r.nombre === nombreRegion);

    if (!region) {
        selectComuna.disabled = true;
        return;
    }

    region.comunas.forEach((comuna) => {
        const opcion = document.createElement("option");
        opcion.value = comuna;
        opcion.textContent = comuna;
        selectComuna.appendChild(opcion);
    });

    selectComuna.disabled = false;
}

// Al cambiar la región, cambian las comunas disponibles
selectRegion.addEventListener("change", () => {
    cargarComunas(selectRegion.value);
});

// Modo editar: carga los campos con el usuario correspondiente al código de la URL
if (runEditar) {
    const usuario = listaUsuarios.find((u) => u.run === runEditar);

    if (!usuario) {
        // Si el run de la url no existe, vuelve al listado
        window.location.href = "usuarios.html";
    } else {
        document.getElementById("titulo-formulario").textContent = "Editar usuario";
        document.getElementById("btn-guardar").textContent = "Guardar cambios";

        document.getElementById("run").value = usuario.run;
        document.getElementById("run").readOnly = true; // el RUN identifica al usuario, no se cambia
        document.getElementById("nombre").value = usuario.nombre;
        document.getElementById("apellidos").value = usuario.apellidos;
        document.getElementById("correo").value = usuario.correo;
        document.getElementById("password").value = usuario.password || "";
        document.getElementById("fechaNacimiento").value = usuario.fechaNacimiento || "";
        document.getElementById("tipoUsuario").value = usuario.tipoUsuario;
        document.getElementById("direccion").value = usuario.direccion;

        // Primero la región (para que existan las comunas) y después la comuna
        document.getElementById("region").value = usuario.region;
        cargarComunas(usuario.region);
        document.getElementById("comuna").value = usuario.comuna;
    }
}

// Validacion en tiempo real al escribir y salir del input
const campos = formulario.querySelectorAll("input, select");

campos.forEach((campo) => {
    campo.addEventListener("keyup", () => validarCampo(campo));
    campo.addEventListener("blur", () => validarCampo(campo));
    campo.addEventListener("change", () => validarCampo(campo)); // para los select y la fecha
});

// Envío del formulario
formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validarFormulario()) return;

    const inputRun = document.getElementById("run");
    const run = inputRun.value.trim().toUpperCase();

    // Valida que el run no exista
    if (!runEditar && listaUsuarios.some((u) => u.run === run)) {
        marcarError(inputRun, `Ya existe un usuario con el RUN ${run}`);
        return;
    }

    const usuario = {
        run: run,
        nombre: document.getElementById("nombre").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        password: document.getElementById("password").value,
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        tipoUsuario: document.getElementById("tipoUsuario").value,
        region: document.getElementById("region").value,
        comuna: document.getElementById("comuna").value,
        direccion: document.getElementById("direccion").value.trim(),
    };

    if (runEditar) {
        // Si esta editando, reemplaza el usuario en la misma posición del arreglo
        const indice = listaUsuarios.findIndex((u) => u.run === runEditar);
        listaUsuarios[indice] = usuario;
    } else {
        // Si es nuevo, lo agrega al final del arreglo
        listaUsuarios.push(usuario);
    }

    guardarUsuarios(listaUsuarios);
    window.location.href = "usuarios.html";
});
