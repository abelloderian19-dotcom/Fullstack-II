const tabla = document.getElementById("tabla-productos");

productos.forEach((producto) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${producto.codigo}</td>
        <td>${producto.nombre}</td>
        <td>${producto.categoria}</td>
        <td>$${producto.precio.toLocaleString("es-CL")}</td>
        <td>
            <a href="producto-detalle.html?codigo=${producto.codigo}" class="btn btn-sm btn-secondary">Ver</a>
            <a href="producto-form.html?codigo=${producto.codigo}" class="btn btn-sm btn-primary">Editar</a>
        </td>
    `;
    tabla.appendChild(fila);
});
