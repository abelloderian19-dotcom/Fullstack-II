window.crearTarjetaProducto = function (producto, nivelTitulo = 3) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "col-12 col-sm-6 col-lg-3";

    const tarjetaBootstrap = document.createElement("div");
    tarjetaBootstrap.className = "card h-100 rounded-0 border-secondary-subtle";

    const enlaceDetalle = document.createElement("a");
    enlaceDetalle.className = "text-dark text-decoration-none";
    enlaceDetalle.href = `./detalle.html?codigo=${encodeURIComponent(producto.codigo)}`;
    enlaceDetalle.setAttribute("aria-label", `Ver detalle de ${producto.nombre}`);

    const imagen = document.createElement("img");
    const marcoImagen = document.createElement("div");
    marcoImagen.className = "ratio ratio-4x3 overflow-hidden";
    imagen.className = "w-100 h-100 object-fit-cover";
    imagen.src = producto.imagen || "./img/products/imagen_inicio.jpg";
    imagen.alt = producto.nombre;
    imagen.loading = "lazy";
    imagen.width = 600;
    imagen.height = 400;

    const titulo = document.createElement(`h${nivelTitulo}`);
    titulo.className = "h6 text-center text-primary mb-0 p-2";
    titulo.textContent = producto.nombre;
    marcoImagen.appendChild(imagen);
    enlaceDetalle.append(marcoImagen, titulo);

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body p-2 d-flex flex-column align-items-center";

    const precio = document.createElement("p");
    precio.className = "fw-semibold text-primary mb-2";
    precio.textContent = `$${producto.precio.toLocaleString("es-CL")}`;

    const boton = document.createElement("button");
    boton.className = "btn btn-primary btn-sm";
    boton.type = "button";
    boton.textContent = "Agregar al carrito";
    const confirmacion = document.createElement("p");
    confirmacion.className = "small text-success mt-2 mb-0 text-center";
    confirmacion.setAttribute("role", "status");
    confirmacion.setAttribute("aria-live", "polite");
    confirmacion.hidden = true;

    boton.addEventListener("click", () => {
        const agregado = window.agregarAlCarrito(producto.codigo);
        confirmacion.textContent = agregado
            ? "Añadido al carrito."
            : "No se pudo añadir. Máximo 99 unidades por producto.";
        confirmacion.classList.toggle("text-danger", !agregado);
        confirmacion.classList.toggle("text-success", agregado);
        confirmacion.hidden = false;
    });

    cuerpo.append(precio, boton, confirmacion);
    tarjetaBootstrap.append(enlaceDetalle, cuerpo);
    tarjeta.appendChild(tarjetaBootstrap);
    return tarjeta;
};
