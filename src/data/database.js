import { categorias, productos as initialProducts } from "./products.js";
import { usuarios as initialUsers } from "./users.js";
import { regiones } from "./regions.js";

const keys = {
  products: "productos",
  users: "usuarios",
  categories: "pasteleria-categorias",
  orders: "pasteleria-ordenes",
  contactMessages: "pasteleria-mensajes-contacto",
};

function readList(key, initialValue) {
  const storedValue = localStorage.getItem(key);
  if (storedValue === null) {
    const initialList = JSON.parse(JSON.stringify(initialValue));
    writeList(key, initialList);
    return initialList;
  }

  let parsedValue;
  try {
    parsedValue = JSON.parse(storedValue);
  } catch (error) {
    throw new Error(`No se pudieron leer los datos guardados (${key}).`, {
      cause: error,
    });
  }

  if (!Array.isArray(parsedValue)) {
    throw new Error(`Los datos guardados (${key}) tienen un formato inválido.`);
  }

  return parsedValue;
}

function writeList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function getProducts() {
  const products = readList(keys.products, initialProducts);
  const normalizedProducts = products.map((product) => {
    const seedProduct = initialProducts.find(
      (seed) => seed.codigo === product.codigo,
    );
    return seedProduct
      ? {
          ...seedProduct,
          ...product,
          descuento:
            product.descuento ?? seedProduct.descuento ?? 0,
        }
      : product;
  });

  if (JSON.stringify(products) !== JSON.stringify(normalizedProducts)) {
    writeList(keys.products, normalizedProducts);
  }
  return normalizedProducts;
}

export function saveProducts(products) {
  writeList(keys.products, products);
}

export function getProduct(code) {
  return getProducts().find((product) => product.codigo === code) ?? null;
}

export function createProduct(product) {
  const products = getProducts();
  if (products.some((item) => item.codigo === product.codigo)) {
    throw new Error(`Ya existe un producto con el código ${product.codigo}.`);
  }

  saveProducts([...products, product]);
  return product;
}

export function updateProduct(code, changes) {
  const products = getProducts();
  const index = products.findIndex((product) => product.codigo === code);
  if (index === -1) {
    throw new Error(`No se encontró el producto ${code}.`);
  }

  const updatedProduct = { ...products[index], ...changes, codigo: code };
  products[index] = updatedProduct;
  saveProducts(products);
  return updatedProduct;
}

export function deleteProduct(code) {
  const products = getProducts();
  if (!products.some((product) => product.codigo === code)) {
    throw new Error(`No se encontró el producto ${code}.`);
  }

  saveProducts(products.filter((product) => product.codigo !== code));
}

export function getCategories() {
  return readList(keys.categories, categorias);
}

export function saveCategories(categories) {
  writeList(keys.categories, categories);
}

export function createCategory(name) {
  const category = name.trim();
  const categories = getCategories();
  if (!category) {
    throw new Error("El nombre de la categoría es obligatorio.");
  }
  if (categories.some((item) => item.toLowerCase() === category.toLowerCase())) {
    throw new Error(`La categoría ${category} ya existe.`);
  }
  saveCategories([...categories, category]);
  return category;
}

export function deleteCategory(name) {
  if (getProducts().some((product) => product.categoria === name)) {
    throw new Error("No se puede eliminar una categoría que tiene productos.");
  }
  const categories = getCategories();
  if (!categories.includes(name)) {
    throw new Error(`No se encontró la categoría ${name}.`);
  }
  saveCategories(categories.filter((category) => category !== name));
}

export function getUsers() {
  return readList(keys.users, initialUsers);
}

export function saveUsers(users) {
  writeList(keys.users, users);
}

export function createUser(user) {
  const users = getUsers();
  if (users.some((item) => item.run === user.run)) {
    throw new Error(`Ya existe un usuario con el RUN ${user.run}.`);
  }
  if (
    users.some(
      (item) => item.correo.toLowerCase() === user.correo.toLowerCase(),
    )
  ) {
    throw new Error(`Ya existe una cuenta con el correo ${user.correo}.`);
  }

  saveUsers([...users, user]);
  return user;
}

export function updateUser(run, changes) {
  const users = getUsers();
  const index = users.findIndex((user) => user.run === run);
  if (index === -1) {
    throw new Error(`No se encontró al usuario ${run}.`);
  }
  const updatedEmail = changes.correo ?? users[index].correo;
  if (
    users.some(
      (user, userIndex) =>
        userIndex !== index &&
        user.correo.toLowerCase() === updatedEmail.toLowerCase(),
    )
  ) {
    throw new Error(`Ya existe una cuenta con el correo ${updatedEmail}.`);
  }
  const updatedUser = { ...users[index], ...changes, run };
  users[index] = updatedUser;
  saveUsers(users);
  return updatedUser;
}

export function deleteUser(run) {
  const users = getUsers();
  if (!users.some((user) => user.run === run)) {
    throw new Error(`No se encontró al usuario ${run}.`);
  }
  saveUsers(users.filter((user) => user.run !== run));
}

export function getRegions() {
  return regiones;
}

export function getOrders() {
  return readList(keys.orders, []);
}

export function getContactMessages() {
  return readList(keys.contactMessages, []);
}

export function createContactMessage(message) {
  const messages = getContactMessages();
  const savedMessage = {
    ...message,
    id: `MSG-${Date.now()}`,
    fecha: new Date().toISOString(),
  };
  writeList(keys.contactMessages, [...messages, savedMessage]);
  return savedMessage;
}

export function saveOrder(order) {
  const orders = getOrders();
  saveOrders([...orders, order]);
  return order;
}

function saveOrders(orders) {
  writeList(keys.orders, orders);
}
