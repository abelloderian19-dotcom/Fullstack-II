import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";
import { StoreProvider } from "../context/StoreContext.jsx";

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
});
