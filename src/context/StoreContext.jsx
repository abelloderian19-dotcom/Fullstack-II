import { createContext, useContext, useMemo, useState } from "react";
import {
  getCategories,
  getProducts,
  saveOrder,
  saveProducts,
} from "../data/database.js";
import { effectivePrice } from "../utils/pricing.js";

const CART_KEY = "pasteleria-carrito";
const StoreContext = createContext(null);

function readCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  if (savedCart === null) {
    return [];
  }

  let parsedCart;
  try {
    parsedCart = JSON.parse(savedCart);
  } catch (error) {
    throw new Error("No se pudo leer el carrito guardado.", { cause: error });
  }

  if (!Array.isArray(parsedCart)) {
    throw new Error("El carrito guardado tiene un formato inválido.");
  }

  return parsedCart.filter(
    (item) =>
      getProducts().some((product) => product.codigo === item.codigo) &&
      Number.isInteger(item.cantidad) &&
      item.cantidad > 0 &&
      item.cantidad <= 99,
  );
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(getProducts);
  const [categories, setCategories] = useState(getCategories);
  const [cart, setCart] = useState(readCart);

  function updateCart(nextCart) {
    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
    setCart(nextCart);
  }

  function addToCart(code, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return false;
    }

    const product = products.find((entry) => entry.codigo === code);
    const item = cart.find((entry) => entry.codigo === code);
    const nextQuantity = (item?.cantidad ?? 0) + quantity;
    if (
      !product ||
      nextQuantity > 99 ||
      (Number.isFinite(product.stock) && nextQuantity > product.stock)
    ) {
      return false;
    }

    updateCart(
      item
        ? cart.map((entry) =>
            entry.codigo === code
              ? { ...entry, cantidad: entry.cantidad + quantity }
              : entry,
          )
        : [...cart, { codigo: code, cantidad: quantity }],
    );
    return true;
  }

  function setCartQuantity(code, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return false;
    }
    const product = products.find((entry) => entry.codigo === code);
    if (
      !cart.some((item) => item.codigo === code) ||
      (Number.isFinite(product?.stock) && quantity > product.stock)
    ) {
      return false;
    }

    updateCart(
      cart.map((item) =>
        item.codigo === code ? { ...item, cantidad: quantity } : item,
      ),
    );
    return true;
  }

  function removeFromCart(code) {
    updateCart(cart.filter((item) => item.codigo !== code));
  }

  function clearCart() {
    updateCart([]);
  }

  function completePurchase(order) {
    const quantities = new Map(
      order.items.map((item) => [item.codigo, item.cantidad]),
    );
    const updatedProducts = products.map((product) => {
      const quantity = quantities.get(product.codigo);
      if (!quantity || !Number.isFinite(product.stock)) return product;
      if (quantity > product.stock) {
        throw new Error(`Stock insuficiente para ${product.nombre}.`);
      }
      return { ...product, stock: product.stock - quantity };
    });

    saveProducts(updatedProducts);
    saveOrder(order);
    setProducts(updatedProducts);
    updateCart([]);
  }

  function replaceProducts(nextProducts) {
    saveProducts(nextProducts);
    setProducts(nextProducts);
    setCategories(getCategories());
    const validCart = cart.filter((item) =>
      nextProducts.some((product) => product.codigo === item.codigo),
    );
    if (validCart.length !== cart.length) {
      updateCart(validCart);
    }
  }

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find(
            (entry) => entry.codigo === item.codigo,
          );
          return product ? { ...item, product } : null;
        })
        .filter(Boolean),
    [cart, products],
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.cantidad, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + effectivePrice(item.product) * item.cantidad,
    0,
  );

  const value = {
    products,
    categories,
    cart,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    setCartQuantity,
    removeFromCart,
    clearCart,
    completePurchase,
    replaceProducts,
    setCategories,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === null) {
    throw new Error("useStore debe utilizarse dentro de StoreProvider.");
  }
  return context;
}
