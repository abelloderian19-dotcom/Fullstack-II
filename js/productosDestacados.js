const productosDestacados = document.getElementById("recommended-grid");
const imagenesPorCodigo = {
    TC001: "./img/products/imagen_inicio.jpg",
    TC002: "./img/products/torta-frutas.jpg",
    TT001: "./img/products/tarta-lucuma.jpg",
    TT002: "./img/products/kuchen-manzana.jpg"
};

if (productosDestacados && Array.isArray(productos)) {
    productos.slice(0, 4).forEach((producto) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "product-card";

        const imagen = document.createElement("img");
        imagen.className = "product-image";
        imagen.src = imagenesPorCodigo[producto.codigo] || "./img/products/imagen_inicio.jpg";
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

        tarjeta.append(imagen, titulo, precio);
        productosDestacados.appendChild(tarjeta);
    });
}
