window.crearTarjetaProducto = function (producto, nivelTitulo = 3) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "product-card";

    const enlaceDetalle = document.createElement("a");
    enlaceDetalle.className = "product-detail-link";
    enlaceDetalle.href = `./detalle.html?codigo=${encodeURIComponent(producto.codigo)}`;
    enlaceDetalle.setAttribute("aria-label", `Ver detalle de ${producto.nombre}`);

    const imagen = document.createElement("img");
    imagen.className = "product-image";
    imagen.src = producto.imagen || "./img/products/imagen_inicio.jpg";
    imagen.alt = producto.nombre;
    imagen.loading = "lazy";
    imagen.width = 600;
    imagen.height = 400;

    const titulo = document.createElement(`h${nivelTitulo}`);
    titulo.className = "product-title";
    titulo.textContent = producto.nombre;
    enlaceDetalle.append(imagen, titulo);

    const precio = document.createElement("p");
    precio.className = "product-price";
    precio.textContent = `$${producto.precio.toLocaleString("es-CL")}`;

    const boton = document.createElement("button");
    boton.className = "add-to-cart";
    boton.type = "button";
    boton.textContent = "Agregar al carrito";
    const confirmacion = document.createElement("p");
    confirmacion.className = "cart-feedback";
    confirmacion.setAttribute("role", "status");
    confirmacion.setAttribute("aria-live", "polite");
    confirmacion.hidden = true;

    boton.addEventListener("click", () => {
        const agregado = window.agregarAlCarrito(producto.codigo);
        confirmacion.textContent = agregado
            ? "Añadido al carrito."
            : "No se pudo añadir. Máximo 99 unidades por producto.";
        confirmacion.classList.toggle("cart-feedback-error", !agregado);
        confirmacion.hidden = false;
    });

    tarjeta.append(enlaceDetalle, precio, boton, confirmacion);
    return tarjeta;
};
