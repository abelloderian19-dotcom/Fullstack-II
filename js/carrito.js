const CART_STORAGE_KEY = "pasteleria-carrito";
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartEmpty = document.getElementById("cart-empty");
const cartLink = document.querySelector(".carrito");
const clearCartButton = document.getElementById("clear-cart");

let carrito = [];

try {
    const guardado = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (Array.isArray(guardado)) {
        carrito = guardado.filter((item) =>
            productos.some((producto) => producto.codigo === item.codigo) &&
            Number.isInteger(item.cantidad) && item.cantidad > 0 && item.cantidad <= 99
        );
    }
} catch {
    carrito = [];
}

function guardarCarrito() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
}

function renderizarCarrito() {
    if (cartItems) cartItems.replaceChildren();
    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach((item) => {
        const producto = productos.find((elemento) => elemento.codigo === item.codigo);
        if (!producto) return;

        const subtotal = producto.precio * item.cantidad;
        total += subtotal;
        cantidadTotal += item.cantidad;
        if (!cartItems) return;

        const fila = document.createElement("li");
        fila.className = "cart-item";

        const imagen = document.createElement("img");
        imagen.className = "cart-item-image";
        imagen.src = producto.imagen || "./img/products/imagen_inicio.jpg";
        imagen.alt = producto.nombre;
        imagen.loading = "lazy";

        const detalle = document.createElement("div");
        detalle.className = "cart-item-details";
        const nombre = document.createElement("strong");
        nombre.textContent = producto.nombre;
        const descripcion = document.createElement("small");
        descripcion.textContent = producto.descripcion;
        detalle.append(nombre, descripcion);

        const precio = document.createElement("strong");
        precio.className = "cart-item-price";
        precio.textContent = `$${producto.precio.toLocaleString("es-CL")}`;

        const cantidad = document.createElement("div");
        cantidad.className = "cart-quantity";
        const restar = document.createElement("button");
        restar.type = "button";
        restar.textContent = "−";
        restar.setAttribute("aria-label", `Reducir cantidad de ${producto.nombre}`);
        restar.disabled = item.cantidad <= 1;
        restar.addEventListener("click", () => cambiarCantidad(item.codigo, item.cantidad - 1));
        const valorCantidad = document.createElement("span");
        valorCantidad.textContent = item.cantidad;
        const sumar = document.createElement("button");
        sumar.type = "button";
        sumar.textContent = "+";
        sumar.setAttribute("aria-label", `Aumentar cantidad de ${producto.nombre}`);
        sumar.disabled = item.cantidad >= 99;
        sumar.addEventListener("click", () => cambiarCantidad(item.codigo, item.cantidad + 1));
        cantidad.append(restar, valorCantidad, sumar);

        const quitar = document.createElement("button");
        quitar.className = "remove-from-cart";
        quitar.type = "button";
        quitar.textContent = "Quitar";
        quitar.setAttribute("aria-label", `Quitar ${producto.nombre} del carrito`);
        quitar.addEventListener("click", () => quitarDelCarrito(item.codigo));

        fila.append(imagen, detalle, precio, cantidad, quitar);
        cartItems.appendChild(fila);
    });

    if (cartCount) cartCount.textContent = cantidadTotal;
    if (cartLink) cartLink.setAttribute("aria-label", `Carrito de compras, ${cantidadTotal} productos`);
    if (cartTotal) cartTotal.textContent = `$${total.toLocaleString("es-CL")}`;
    if (cartEmpty) cartEmpty.hidden = carrito.length > 0;
    if (clearCartButton) clearCartButton.disabled = carrito.length === 0;
}

function agregarAlCarrito(codigo, cantidad = 1) {
    if (!productos.some((producto) => producto.codigo === codigo) ||
        !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) return false;
    const existente = carrito.find((item) => item.codigo === codigo);
    if (existente) {
        if (existente.cantidad + cantidad > 99) return false;
        existente.cantidad += cantidad;
    } else {
        carrito.push({ codigo, cantidad });
    }
    guardarCarrito();
    renderizarCarrito();
    return true;
}

function cambiarCantidad(codigo, cantidad) {
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) return;
    const item = carrito.find((producto) => producto.codigo === codigo);
    if (!item) return;
    item.cantidad = cantidad;
    guardarCarrito();
    renderizarCarrito();
}

function quitarDelCarrito(codigo) {
    carrito = carrito.filter((item) => item.codigo !== codigo);
    guardarCarrito();
    renderizarCarrito();
}

window.agregarAlCarrito = agregarAlCarrito;

if (clearCartButton) {
    clearCartButton.addEventListener("click", () => {
        carrito = [];
        guardarCarrito();
        renderizarCarrito();
    });
}

renderizarCarrito();
