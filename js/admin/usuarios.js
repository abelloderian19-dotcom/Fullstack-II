const tabla = document.getElementById("tabla-usuarios");

const listaUsuarios = obtenerUsuarios();

listaUsuarios.forEach((usuario) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${usuario.run}</td>
        <td>${usuario.nombre} ${usuario.apellidos}</td>
        <td>${usuario.correo}</td>
        <td>${usuario.tipoUsuario}</td>
        <td>
            <a href="usuario-detalle.html?run=${usuario.run}" class="btn btn-sm btn-secondary">Ver</a>
            <a href="usuario-form.html?run=${usuario.run}" class="btn btn-sm btn-primary">Editar</a>
        </td>
    `;
    tabla.appendChild(fila);
});
