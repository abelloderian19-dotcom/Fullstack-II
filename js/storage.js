const CLAVE_PRODUCTOS = "productos";

// Esta funcion devuelve los productos guardados en localStorage. Si no hay productos guardados, guarda los productos iniciales (js/data/productos.js) y los devuelve.
function obtenerProductos() {
    const guardados = localStorage.getItem(CLAVE_PRODUCTOS);

    if (!guardados) {
        guardarProductos(productos);
        return productos;
    }

    return JSON.parse(guardados);
}

// Reemplaza los productos guardados en localStorage por la lista recibida.
function guardarProductos(lista) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(lista));
}
