// Formulario de producto para crear y editar
// Si la URL tiene ?codigo=XXX se carga el producto con ese id y queda en modo edición

const formulario = document.getElementById("form-producto");
const selectCategoria = document.getElementById("categoria");

const parametros = new URLSearchParams(window.location.search);
const codigoEditar = parametros.get("codigo");

const listaProductos = obtenerProductos();

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
        case "codigo":
            // Requerido, texto, mínimo 3 caracteres, sin máximo
            mensaje = esRequerido(valor) || largoMinimo(valor, 3);
            break;

        case "nombre":
            // Requerido, máximo 100
            mensaje = esRequerido(valor) || largoMaximo(valor, 100);
            break;

        case "descripcion":
            // Opcional, máximo 500
            mensaje = largoMaximo(valor, 500);
            break;

        case "precio":
            // Requerido, mínimo 0, puede tener decimales
            mensaje = esRequerido(valor) || esDecimal(valor) || esMayorIgualQue(valor, 0);
            break;

        case "stock":
            // Requerido, mínimo 0, solo enteros
            mensaje = esRequerido(valor) || esEntero(valor) || esMayorIgualQue(valor, 0);
            break;

        case "stockCritico":
            // Opcional: si está vacío es válido; si tiene algo, mínimo 0 y solo enteros
            if (valor !== "") {
                mensaje = esEntero(valor) || esMayorIgualQue(valor, 0);
            }
            break;

        case "categoria":
            // Requerido (select)
            mensaje = esRequerido(valor);
            break;

        case "imagen":
            // Opcional, sin reglas
            break;
    }

    if (mensaje) {
        marcarError(input, mensaje);
        return false;
    }

    marcarValido(input);
    return true;
}

// Valida todos los campos del formulario, devuelve true si todos son validos
// y false si alguno no lo es
function validarFormulario() {
    const ids = ["codigo", "nombre", "descripcion", "precio", "stock", "stockCritico", "categoria", "imagen"];
    let valido = true;

    ids.forEach((id) => {
        const input = document.getElementById(id);
        if (!validarCampo(input)) valido = false;
    });

    return valido;
}

// Llena el select de categorias, usando el arreglo de categorias definido en js/data/productos.js
categorias.forEach((categoria) => {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria;
    selectCategoria.appendChild(opcion);
});


// Modo editar: carga los campos con el producto correspondiente al código de la URL
if (codigoEditar) {
    const producto = listaProductos.find((p) => p.codigo === codigoEditar);

    if (!producto) {
        // Si el codigo del producto no existe, vuelve al listado
        window.location.href = "productos.html";
    } else {
        document.getElementById("titulo-formulario").textContent = "Editar producto";
        document.getElementById("btn-guardar").textContent = "Guardar cambios";

        document.getElementById("codigo").value = producto.codigo;
        // readOnly para el codigo, ya que este no debe cambiar
        document.getElementById("codigo").readOnly = true; 
        document.getElementById("nombre").value = producto.nombre;
        document.getElementById("descripcion").value = producto.descripcion || "";
        document.getElementById("precio").value = producto.precio;
        document.getElementById("stock").value = producto.stock ?? "";
        document.getElementById("stockCritico").value = producto.stockCritico ?? "";
        document.getElementById("categoria").value = producto.categoria;
        document.getElementById("imagen").value = producto.imagen || "";
    }
}

// Validacion en tiempo real al escribir y salir del input
const campos = formulario.querySelectorAll("input, select, textarea");

campos.forEach((campo) => {
    campo.addEventListener("keyup", () => validarCampo(campo));
    campo.addEventListener("blur", () => validarCampo(campo));
    campo.addEventListener("change", () => validarCampo(campo)); // para el select
});

// Envío del formulario
formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validarFormulario()) return;

    const inputCodigo = document.getElementById("codigo");
    const codigo = inputCodigo.value.trim().toUpperCase();

    // Valida que el código no exista
    if (!codigoEditar && listaProductos.some((p) => p.codigo === codigo)) {
        marcarError(inputCodigo, `Ya existe un producto con el código ${codigo}`);
        return;
    }

    const stockCritico = document.getElementById("stockCritico").value.trim();

    const producto = {
        codigo: codigo,
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        precio: Number(document.getElementById("precio").value.trim().replace(",", ".")),
        stock: Number(document.getElementById("stock").value.trim()),
        stockCritico: stockCritico === "" ? null : Number(stockCritico),
        categoria: document.getElementById("categoria").value,
        imagen: document.getElementById("imagen").value.trim(),
    };

    if (codigoEditar) {
        // Si esta editando, reemplaza el producto en la misma posición del arreglo
        const indice = listaProductos.findIndex((p) => p.codigo === codigoEditar);
        listaProductos[indice] = producto;
    } else {
        // Si es nuevo, lo agrega al final del arreglo
        listaProductos.push(producto);
    }

    guardarProductos(listaProductos);
    window.location.href = "productos.html";
});
