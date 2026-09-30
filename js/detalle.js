const codigoProducto = new URLSearchParams(window.location.search).get("codigo");
const productoDetalle = productos.find((producto) => producto.codigo === codigoProducto);
const vistaDetalle = document.getElementById("product-detail");
const errorDetalle = document.getElementById("detail-error");
const relacionados = document.getElementById("related-grid");

if (!productoDetalle) {
    vistaDetalle.hidden = true;
    document.querySelector(".related-products").hidden = true;
    errorDetalle.hidden = false;
} else {
    document.title = `${productoDetalle.nombre} | Pastelería 1000 Sabores`;
    document.getElementById("detail-breadcrumb").textContent = productoDetalle.nombre;
    document.getElementById("detail-name").textContent = productoDetalle.nombre;
    document.getElementById("detail-price").textContent = `$${productoDetalle.precio.toLocaleString("es-CL")}`;
    document.getElementById("detail-description").textContent = productoDetalle.descripcion;

    const imagen = document.getElementById("detail-image");
    imagen.src = productoDetalle.imagen || "./img/products/imagen_inicio.jpg";
    imagen.alt = productoDetalle.nombre;

    const miniaturas = document.getElementById("detail-thumbnails");
    [1, 2, 3].forEach((numero) => {
        const botonMiniatura = document.createElement("button");
        botonMiniatura.type = "button";
        botonMiniatura.className = `btn p-0 border rounded-0 ${numero === 1 ? "border-primary border-2" : "border-secondary"}`;
        botonMiniatura.setAttribute("aria-label", `Mostrar imagen ${numero} de ${productoDetalle.nombre}`);
        botonMiniatura.setAttribute("aria-pressed", numero === 1 ? "true" : "false");

        const fotoMiniatura = document.createElement("img");
        fotoMiniatura.src = imagen.src;
        fotoMiniatura.alt = "";
        fotoMiniatura.width = 52;
        fotoMiniatura.height = 52;
        fotoMiniatura.className = "object-fit-cover";
        botonMiniatura.appendChild(fotoMiniatura);
        botonMiniatura.addEventListener("click", () => {
            imagen.src = fotoMiniatura.src;
            miniaturas.querySelectorAll("button").forEach((boton) => {
                boton.classList.remove("border-primary", "border-2");
                boton.classList.add("border-secondary");
                boton.setAttribute("aria-pressed", "false");
            });
            botonMiniatura.classList.remove("border-secondary");
            botonMiniatura.classList.add("border-primary", "border-2");
            botonMiniatura.setAttribute("aria-pressed", "true");
        });
        miniaturas.appendChild(botonMiniatura);
    });

    productos.filter((producto) => producto.codigo !== productoDetalle.codigo)
        .slice(0, 5)
        .forEach((producto) => {
            const enlace = document.createElement("a");
            enlace.className = "col text-dark text-decoration-none";
            enlace.href = `./detalle.html?codigo=${encodeURIComponent(producto.codigo)}`;
            const tarjetaRelacionada = document.createElement("article");
            tarjetaRelacionada.className = "card h-100 rounded-0";
            const contenedorFoto = document.createElement("div");
            contenedorFoto.className = "ratio ratio-4x3 overflow-hidden";
            const foto = document.createElement("img");
            foto.className = "w-100 h-100 object-fit-cover rounded-0";
            foto.src = producto.imagen || "./img/products/imagen_inicio.jpg";
            foto.alt = producto.nombre;
            foto.loading = "lazy";
            const nombre = document.createElement("span");
            nombre.className = "card-body small text-center";
            nombre.textContent = producto.nombre;
            contenedorFoto.appendChild(foto);
            tarjetaRelacionada.append(contenedorFoto, nombre);
            enlace.appendChild(tarjetaRelacionada);
            relacionados.appendChild(enlace);
        });

    const formDetalle = document.getElementById("add-product-form");
    const cantidadInput = document.getElementById("detail-quantity");
    const errorCantidad = document.getElementById("quantity-error");
    const mensajeAgregado = document.getElementById("added-message");

    formDetalle.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const cantidad = Number(cantidadInput.value);
        if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
            errorCantidad.textContent = "Ingresa una cantidad entera entre 1 y 99.";
            cantidadInput.setAttribute("aria-invalid", "true");
            cantidadInput.classList.add("is-invalid");
            mensajeAgregado.textContent = "";
            cantidadInput.focus();
            return;
        }

        const agregado = window.agregarAlCarrito(productoDetalle.codigo, cantidad);
        if (!agregado) {
            errorCantidad.textContent = "La cantidad total de este producto no puede superar 99.";
            cantidadInput.setAttribute("aria-invalid", "true");
            cantidadInput.classList.add("is-invalid");
            mensajeAgregado.textContent = "";
            return;
        }

        errorCantidad.textContent = "";
        cantidadInput.removeAttribute("aria-invalid");
        cantidadInput.classList.remove("is-invalid");
        mensajeAgregado.textContent = "Producto agregado al carrito.";
    });

    cantidadInput.addEventListener("input", () => {
        errorCantidad.textContent = "";
        cantidadInput.removeAttribute("aria-invalid");
        cantidadInput.classList.remove("is-invalid");
        mensajeAgregado.textContent = "";
    });
}
