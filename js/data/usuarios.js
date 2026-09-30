// Roles asociados al sistema (Anexo 1):
// - Administrador: tiene acceso total al sistema.
// - Vendedor: puede visualizar la lista de productos y su detalle, y la lista de órdenes y su detalle.
// - Cliente: solo puede acceder a la tienda.
const tiposUsuario = ["Administrador", "Vendedor", "Cliente"];

const usuarios = [
  {
    run: "123456785",
    nombre: "Ana",
    apellidos: "Pérez Soto",
    correo: "ana.perez@duoc.cl",
    fechaNacimiento: "1985-03-14",
    tipoUsuario: "Administrador",
    region: "Región Metropolitana de Santiago",
    comuna: "Santiago",
    direccion: "Av. Libertador Bernardo O'Higgins 1234",
    password: "admin123",
  },
  {
    run: "187654327",
    nombre: "Carlos",
    apellidos: "Muñoz Rojas",
    correo: "carlos.munoz@profesor.duoc.cl",
    fechaNacimiento: "1990-07-22",
    tipoUsuario: "Vendedor",
    region: "Región Metropolitana de Santiago",
    comuna: "San Bernardo",
    direccion: "Calle Los Aromos 456",
    password: "vende123",
  },
  {
    run: "204567891",
    nombre: "María",
    apellidos: "González Díaz",
    correo: "maria.gonzalez@gmail.com",
    fechaNacimiento: "2001-11-05",
    tipoUsuario: "Cliente",
    region: "Región de Valparaíso",
    comuna: "Viña del Mar",
    direccion: "Av. Libertad 789",
    password: "cliente1",
  },
];
