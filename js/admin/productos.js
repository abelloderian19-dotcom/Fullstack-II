const tabla = document.getElementById("tabla-productos");
const mensaje = document.getElementById("mensaje");

// Se leen desde localStorage (ver js/storage.js), no directo del arreglo del archivo.
// es let y no const porque se modifica al eliminar un producto
let listaProductos = obtenerProductos();

// Vacía la tabla y la vuelve a llenar con la lista actual
function pintarTabla() {
    tabla.innerHTML = "";

    listaProductos.forEach((producto) => {
        let celdaStock = producto.stock;
        if (producto.stockCritico != null && celdaStock <= producto.stockCritico) {
            celdaStock = `<span class="text-danger">Stock crítico: ${producto.stock.toLocaleString("es-CL")}</span>`;
        }
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.codigo}</td>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>$${producto.precio.toLocaleString("es-CL")}</td>
            <td>${celdaStock}</td>
            <td class="text-nowrap">
                <a href="../detalle.html?codigo=${producto.codigo}" class="btn btn-sm btn-secondary">Ver</a>
                <a href="producto-form.html?codigo=${producto.codigo}" class="btn btn-sm btn-primary">Editar</a>
                <button type="button" class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
            </td>
        `;

        // El botón Eliminar de esta fila elimina este producto
        fila.querySelector(".btn-eliminar").addEventListener("click", () => {
            eliminarProducto(producto.codigo);
        });

        tabla.appendChild(fila);
    });
}

// Quita el producto de la lista, guarda en localStorage y repinta la tabla
function eliminarProducto(codigo) {
    const producto = listaProductos.find((p) => p.codigo === codigo);

    // Devuelve una nueva lista pero sin el producto indicado
    listaProductos = listaProductos.filter((p) => p.codigo !== codigo);

    guardarProductos(listaProductos);
    pintarTabla();

    mensaje.textContent = `Producto ${producto.codigo} - ${producto.nombre} eliminado`;
    mensaje.classList.remove("d-none");
}

pintarTabla();
