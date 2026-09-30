const productosDestacados = document.getElementById("recommended-grid");

if (productosDestacados && Array.isArray(productos)) {
    productos.slice(0, 8).forEach((producto) => {
        productosDestacados.appendChild(window.crearTarjetaProducto(producto));
    });
}
