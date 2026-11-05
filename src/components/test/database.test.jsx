import {
  createCategory,
  createProduct,
  createUser,
  deleteCategory,
  deleteProduct,
  deleteUser,
  getCategories,
  getProduct,
  getProducts,
  getUsers,
  updateProduct,
} from "../../data/database.js";

describe("mock database", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates, reads, updates, and deletes products", () => {
    const product = {
      ...getProducts()[0],
      codigo: "TEST001",
      nombre: "Producto de prueba",
    };

    createProduct(product);
    expect(getProduct("TEST001").nombre).toBe("Producto de prueba");

    updateProduct("TEST001", { nombre: "Producto actualizado" });
    expect(getProduct("TEST001").nombre).toBe("Producto actualizado");

    deleteProduct("TEST001");
    expect(getProduct("TEST001")).toBeNull();
  });

  it("creates and deletes categories that are not in use", () => {
    createCategory("Pruebas");
    expect(getCategories()).toContain("Pruebas");

    deleteCategory("Pruebas");
    expect(getCategories()).not.toContain("Pruebas");
  });

  it("creates and deletes users", () => {
    const user = {
      run: "111111111",
      nombre: "Usuario",
      apellidos: "Prueba",
      correo: "prueba@example.com",
      password: "pass1234",
      tipoUsuario: "Cliente",
    };

    createUser(user);
    expect(getUsers().some((entry) => entry.run === user.run)).toBe(true);

    deleteUser(user.run);
    expect(getUsers().some((entry) => entry.run === user.run)).toBe(false);
  });
});
