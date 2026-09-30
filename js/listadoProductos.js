const catalogoProductos = document.getElementById("product-catalog");

if (catalogoProductos && Array.isArray(productos)) {
    productos.forEach((producto) => {
        catalogoProductos.appendChild(window.crearTarjetaProducto(producto, 2));
    });
}
