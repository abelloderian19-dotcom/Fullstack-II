import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StoreProvider } from "../../context/StoreContext.jsx";
import { getProducts } from "../../data/database.js";
import CartPage from "../../pages/CartPage.jsx";

function renderCart(quantity) {
  const product = getProducts()[0];
  localStorage.setItem(
    "pasteleria-carrito",
    JSON.stringify([{ codigo: product.codigo, cantidad: quantity }]),
  );

  render(
    React.createElement(
      StoreProvider,
      null,
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/carrito"] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: "/carrito",
            element: React.createElement(CartPage),
          }),
        ),
      ),
    ),
  );

  return product;
}

describe("CartPage quantity controls", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("increments and persists the cart quantity", () => {
    const product = renderCart(1);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Aumentar cantidad de " + product.nombre,
      }),
    );

    expect(screen.getByLabelText("2 unidades")).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem("pasteleria-carrito"))[0].cantidad,
    ).toBe(2);
  });

  it("decrements and persists the cart quantity", () => {
    const product = renderCart(2);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Reducir cantidad de " + product.nombre,
      }),
    );

    expect(screen.getByLabelText("1 unidad")).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem("pasteleria-carrito"))[0].cantidad,
    ).toBe(1);
  });
});
