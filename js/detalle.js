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
    document.getElementById("detail-category").textContent = productoDetalle.categoria;
    document.getElementById("detail-name").textContent = productoDetalle.nombre;
    document.getElementById("detail-price").textContent = `$${productoDetalle.precio.toLocaleString("es-CL")}`;
    document.getElementById("detail-description").textContent = productoDetalle.descripcion;

    const imagen = document.getElementById("detail-image");
    imagen.src = productoDetalle.imagen || "./img/products/imagen_inicio.jpg";
    imagen.alt = productoDetalle.nombre;

    productos.filter((producto) => producto.codigo !== productoDetalle.codigo)
        .slice(0, 4)
        .forEach((producto) => {
            const enlace = document.createElement("a");
            enlace.className = "related-card";
            enlace.href = `./detalle.html?codigo=${encodeURIComponent(producto.codigo)}`;
            const foto = document.createElement("img");
            foto.src = producto.imagen || "./img/products/imagen_inicio.jpg";
            foto.alt = producto.nombre;
            foto.loading = "lazy";
            const nombre = document.createElement("span");
            nombre.textContent = producto.nombre;
            enlace.append(foto, nombre);
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
            mensajeAgregado.textContent = "";
            cantidadInput.focus();
            return;
        }

        const agregado = window.agregarAlCarrito(productoDetalle.codigo, cantidad);
        if (!agregado) {
            errorCantidad.textContent = "La cantidad total de este producto no puede superar 99.";
            cantidadInput.setAttribute("aria-invalid", "true");
            mensajeAgregado.textContent = "";
            return;
        }

        errorCantidad.textContent = "";
        cantidadInput.removeAttribute("aria-invalid");
        mensajeAgregado.textContent = "Producto agregado al carrito.";
    });

    cantidadInput.addEventListener("input", () => {
        errorCantidad.textContent = "";
        cantidadInput.removeAttribute("aria-invalid");
        mensajeAgregado.textContent = "";
    });
}
