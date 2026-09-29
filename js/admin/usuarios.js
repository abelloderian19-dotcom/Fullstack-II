const tabla = document.getElementById("tabla-usuarios");
const mensaje = document.getElementById("mensaje");

// Se leen desde localStorage (ver js/storage.js), no directo del arreglo del archivo
// es let y no const porque se modifica al eliminar un usuario
let listaUsuarios = obtenerUsuarios();

function pintarTabla() {
    tabla.innerHTML = "";


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
            <button type="button" class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
        </td>
    `;

        // El botón Eliminar de esta fila elimina este usuario
        fila.querySelector(".btn-eliminar").addEventListener("click", () => {
            eliminarUsuario(usuario.run);
        });

        tabla.appendChild(fila);
    });

}


function eliminarUsuario(run){
    const usuario = listaUsuarios.find((u) => u.run === run);

    // Devuelve una nueva lista pero sin el usuario indicado
    listaUsuarios = listaUsuarios.filter((u) => u.run !== run);

    guardarUsuarios(listaUsuarios);
    pintarTabla();

    mensaje.textContent = `Usuario ${usuario.run} - ${usuario.nombre} ${usuario.apellidos} eliminado`;
    mensaje.classList.remove("d-none");
}

pintarTabla();