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
            Number.isInteger(item.cantidad) && item.cantidad > 0
        );
    }
} catch {
    carrito = [];
}

function guardarCarrito() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
}

function renderizarCarrito() {
    cartItems.replaceChildren();
    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach((item) => {
        const producto = productos.find((elemento) => elemento.codigo === item.codigo);
        if (!producto) return;

        const subtotal = producto.precio * item.cantidad;
        total += subtotal;
        cantidadTotal += item.cantidad;

        const fila = document.createElement("li");
        fila.className = "cart-item";
        const detalle = document.createElement("span");
        detalle.textContent = `${producto.nombre} × ${item.cantidad}`;
        const precio = document.createElement("strong");
        precio.textContent = `$${subtotal.toLocaleString("es-CL")}`;
        const quitar = document.createElement("button");
        quitar.className = "remove-from-cart";
        quitar.type = "button";
        quitar.textContent = "Quitar";
        quitar.setAttribute("aria-label", `Quitar ${producto.nombre} del carrito`);
        quitar.addEventListener("click", () => quitarDelCarrito(item.codigo));
        fila.append(detalle, precio, quitar);
        cartItems.appendChild(fila);
    });

    cartCount.textContent = cantidadTotal;
    cartLink.setAttribute("aria-label", `Carrito de compras, ${cantidadTotal} productos`);
    cartTotal.textContent = `$${total.toLocaleString("es-CL")}`;
    cartEmpty.hidden = carrito.length > 0;
    clearCartButton.disabled = carrito.length === 0;
}

function agregarAlCarrito(codigo) {
    const existente = carrito.find((item) => item.codigo === codigo);
    if (existente) existente.cantidad += 1;
    else carrito.push({ codigo, cantidad: 1 });
    guardarCarrito();
    renderizarCarrito();
}

function quitarDelCarrito(codigo) {
    carrito = carrito.filter((item) => item.codigo !== codigo);
    guardarCarrito();
    renderizarCarrito();
}

window.agregarAlCarrito = agregarAlCarrito;
clearCartButton.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
});

renderizarCarrito();
