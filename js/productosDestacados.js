const productosDestacados = document.getElementById("recommended-grid");

if (productosDestacados && Array.isArray(productos)) {
    productos.slice(0, 4).forEach((producto) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "product-card";

        const imagen = document.createElement("img");
        imagen.className = "product-image";
        imagen.src = producto.imagen || "./img/products/imagen_inicio.jpg";
        imagen.alt = producto.nombre;
        imagen.loading = "lazy";
        imagen.width = 600;
        imagen.height = 400;

        const titulo = document.createElement("h3");
        titulo.className = "product-title";
        titulo.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.className = "product-price";
        precio.textContent = `$${producto.precio.toLocaleString("es-CL")}`;

        const boton = document.createElement("button");
        boton.className = "add-to-cart";
        boton.type = "button";
        boton.textContent = "Agregar al carrito";
        boton.addEventListener("click", () => window.agregarAlCarrito(producto.codigo));

        tarjeta.append(imagen, titulo, precio, boton);
        productosDestacados.appendChild(tarjeta);
    });
}
