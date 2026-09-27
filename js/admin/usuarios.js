const tabla = document.getElementById("tabla-usuarios");

usuarios.forEach((usuario) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td class="no-wrap">${usuario.run}</td>
        <td class="no-wrap">${usuario.nombre} ${usuario.apellidos}</td>
        <td class="no-wrap">${usuario.correo}</td>
        <td class="no-wrap">${usuario.tipoUsuario}</td>
        <td>
            <a href="usuario-detalle.html?run=${usuario.run}" class="btn btn-sm btn-secondary">Ver</a>
            <a href="usuario-form.html?run=${usuario.run}" class="btn btn-sm btn-primary">Editar</a>
        </td>
    `;
    tabla.appendChild(fila);
});
