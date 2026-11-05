import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import { StoreProvider } from "../context/StoreContext.jsx";
import ActionButton from "./ActionButton.jsx";
import { getProducts } from "../data/database.js";

describe("ProductCard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("uses product props to render the item and its offer", () => {
    const product = {
      codigo: "DEMO001",
      nombre: "Postre de prueba",
      categoria: "Postres Individuales",
      precio: 1000,
      descuento: 10,
      stock: 2,
      imagen: "",
    };

    render(
      React.createElement(
        StoreProvider,
        null,
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(ProductCard, { product }),
        ),
      ),
    );

    expect(screen.getByRole("heading", { name: "Postre de prueba" })).toBeTruthy();
    expect(screen.getByText("10% de descuento")).toBeTruthy();
    expect(screen.getByText("$900")).toBeTruthy();
  });

  it("passes the button label and click handler through its props", () => {
    const onClick = jasmine.createSpy("onClick");

    render(
      React.createElement(ActionButton, { onClick, className: "test-button" }, "Comprar"),
    );

    const button = screen.getByRole("button", { name: "Comprar" });
    expect(button.className).toBe("test-button");
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows conditional feedback when adding a product fails", () => {
    const product = getProducts()[0];
    localStorage.setItem("pasteleria-carrito", JSON.stringify([
      { codigo: product.codigo, cantidad: product.stock },
    ]));

    render(
      React.createElement(
        StoreProvider,
        null,
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(ProductCard, { product }),
        ),
      ),
    );

    expect(screen.queryByRole("status")).toBeNull();
    screen.getByRole("button", { name: "Agregar al carrito" }).click();
    expect(screen.getByRole("status").textContent).toContain("No se pudo");
  });
});
