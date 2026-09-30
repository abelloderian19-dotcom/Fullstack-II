const formRegistro = document.getElementById("form-registro");
const inputsRegistro = document.querySelectorAll("#form-registro input, #form-registro select");

inputsRegistro.forEach((input) => {
    input.addEventListener("input", () => validarCampo(input));
    if (input.tagName === "SELECT") {
        input.addEventListener("change", () => validarCampo(input));
    }
});

function mostrarError(input, mensaje) {
    const spanError = document.getElementById(`${input.name}-error`);
    if (mensaje) {
        input.classList.add("is-invalid");
        if (spanError) spanError.textContent = mensaje;
    } else {
        input.classList.remove("is-invalid");
        if (spanError) spanError.textContent = "";
    }
}

function validarCampo(input) {
    const valor = input.value.trim();
    let error = null;

    switch (input.name) {
        case "run":
            error = esRequerido(valor) || validarRun(valor);
            break;
        case "nombre":
            error = esRequerido(valor) || largoMaximo(valor, 50);
            break;
        case "apellidos":
            error = esRequerido(valor) || largoMaximo(valor, 100);
            break;
        case "correo":
            error = esRequerido(valor) || largoMaximo(valor, 100) || dominioPermitido(valor);
            break;
        case "password":
            error = esRequerido(valor) || largoMinimo(valor, 4) || largoMaximo(valor, 10);
            break;
        case "confirmar-password":
            const password = document.getElementById("reg-password").value;
            error = esRequerido(valor) || (valor !== password ? "Las contraseñas no coinciden" : null);
            break;
        case "direccion":
            error = esRequerido(valor) || largoMaximo(valor, 300);
            break;
        case "region":
        case "comuna":
            error = esRequerido(valor);
            break;
        default:
            return;
    }

    mostrarError(input, error);
}

formRegistro.addEventListener("submit", (evento) => {
    evento.preventDefault();
    inputsRegistro.forEach((input) => validarCampo(input));

    const hayErrores = document.querySelector(".is-invalid");
    if (hayErrores) {
        hayErrores.focus();
        return;
    }

    alert("Registro validado correctamente");
    formRegistro.reset();
});

const selectRegion = document.getElementById("reg-region");
const selectComuna = document.getElementById("reg-comuna");

regiones.forEach((region) => {
    const opcion = document.createElement("option");
    opcion.value = region.nombre;
    opcion.textContent = region.nombre;
    selectRegion.appendChild(opcion);
});

selectRegion.addEventListener("change", () => {
    selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';

    const regionElegida = regiones.find((region) => region.nombre === selectRegion.value);
    if (!regionElegida) return;

    regionElegida.comunas.forEach((comuna) => {
        const opcion = document.createElement("option");
        opcion.value = comuna;
        opcion.textContent = comuna;
        selectComuna.appendChild(opcion);
    });
});