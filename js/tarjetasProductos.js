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
    boton.addEventListener("click", () => window.agregarAlCarrito(producto.codigo));

    tarjeta.append(enlaceDetalle, precio, boton);
    return tarjeta;
};
