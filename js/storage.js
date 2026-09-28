const CLAVE_PRODUCTOS = "productos";
const CLAVE_USUARIOS = "usuarios";

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

// Lo mismo con usuarios
function obtenerUsuarios(){
    const guardados = localStorage.getItem(CLAVE_USUARIOS);

    if (!guardados) {
        guardarUsuarios(usuarios);
        return usuarios;
    }

    return JSON.parse(guardados);
}

function guardarUsuarios(lista){
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
}