import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StoreProvider } from "../context/StoreContext.jsx";
import ProductCatalogPage from "./ProductCatalogPage.jsx";

function renderCatalog() {
  render(
    React.createElement(
      StoreProvider,
      null,
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/productos"] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: "/productos",
            element: React.createElement(ProductCatalogPage),
          }),
        ),
      ),
    ),
  );
}

describe("ProductCatalogPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders every product from the catalog", () => {
    renderCatalog();

    expect(
      screen.getAllByRole("button", { name: "Agregar al carrito" }).length,
    ).toBe(16);
  });

  it("filters products by the selected category", () => {
    renderCatalog();
    fireEvent.change(screen.getByLabelText("Filtrar por categoría"), {
      target: { value: "Tortas Cuadradas" },
    });

    expect(
      screen.getAllByRole("button", { name: "Agregar al carrito" }).length,
    ).toBe(2);
    expect(screen.getByText("Torta Cuadrada de Chocolate")).toBeTruthy();
    expect(screen.queryByText("Mousse de Chocolate")).toBeNull();
  });
});
