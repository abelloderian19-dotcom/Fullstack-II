import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StoreProvider } from "../../context/StoreContext.jsx";
import CategoryPage from "../../pages/CategoryPage.jsx";

describe("CategoryPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("uses an image from each category's first product ID", () => {
    render(
      React.createElement(
        StoreProvider,
        null,
        React.createElement(
          MemoryRouter,
          { initialEntries: ["/categorias"] },
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: "/categorias",
              element: React.createElement(CategoryPage),
            }),
          ),
        ),
      ),
    );

    const categoryImages = screen.getAllByRole("img");
    expect(categoryImages.length).toBe(8);
    expect(
      screen
        .getByRole("img", { name: "Productos de Tortas Cuadradas" })
        .getAttribute("src"),
    ).toBe("/img/products/web-TC001.jpg");
    expect(new Set(categoryImages.map((image) => image.getAttribute("src"))).size)
      .toBe(8);
  });
});
