// Agrega productos nuevos a esta lista; las tarjetas se crean automáticamente.
const productos = [
    {
        nombre: "Torta de Chocolate",
        precio: 25000,
        imagen: "./img/products/torta-chocolate.jpg",
        descripcionImagen: "Torta de chocolate"
    },
    {
        nombre: "Torta de Frutas",
        precio: 28000,
        imagen: "./img/products/torta-frutas.jpg",
        descripcionImagen: "Torta con frutas"
    },
    {
        nombre: "Cheesecake",
        precio: 22000,
        imagen: "./img/products/cheesecake.jpg",
        descripcionImagen: "Porciones de cheesecake"
    },
    {
        nombre: "Kuchen de Manzana",
        precio: 18000,
        imagen: "./img/products/kuchen-manzana.jpg",
        descripcionImagen: "Kuchen de manzana"
    },
    {
        nombre: "Brownies (caja x6)",
        precio: 12000,
        imagen: "./img/products/brownies.jpg",
        descripcionImagen: "Brownies de chocolate"
    },
    {
        nombre: "Cupcakes (caja x4)",
        precio: 10000,
        imagen: "./img/products/cupcakes.jpg",
        descripcionImagen: "Cupcakes decorados"
    },
    {
        nombre: "Tarta de Lúcuma",
        precio: 24000,
        imagen: "./img/products/tarta-lucuma.jpg",
        descripcionImagen: "Tarta de frutas"
    },
    {
        nombre: "Alfajores (caja x8)",
        precio: 9000,
        imagen: "./img/products/alfajores.jpg",
        descripcionImagen: "Alfajores rellenos"
    }
];

function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "product-card";

    const imagen = document.createElement("img");
    imagen.className = "product-image";
    imagen.src = producto.imagen;
    imagen.alt = producto.descripcionImagen;
    imagen.loading = "lazy";
    imagen.decoding = "async";

    const nombre = document.createElement("h2");
    nombre.className = "product-title";
    nombre.textContent = producto.nombre;

    const precio = document.createElement("p");
    precio.className = "product-price";
    precio.textContent = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    }).format(producto.precio);

    tarjeta.append(imagen, nombre, precio);
    return tarjeta;
}

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("products-grid");
    if (!contenedor) return;

    const tarjetas = productos.map(crearTarjetaProducto);
    contenedor.replaceChildren(...tarjetas);
});
