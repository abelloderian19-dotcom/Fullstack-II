import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SiteHeader from "../SiteHeader.jsx";
import { StoreProvider } from "../../context/StoreContext.jsx";
import HomePage from "../../pages/HomePage.jsx";

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function renderHome() {
    return render(
      React.createElement(
        StoreProvider,
        null,
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(
            React.Fragment,
            null,
            React.createElement(SiteHeader),
            React.createElement(HomePage),
          ),
        ),
      ),
    );
  }

  it("renders the store introduction and product link", () => {
    renderHome();

    expect(
      screen.getByRole("heading", {
        name: "Dulces momentos, hechos para compartir.",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Ver productos" }).getAttribute("href"),
    ).toBe("/productos");
  });

  it("renders three carousel slides and moves to the next image", () => {
    renderHome();

    expect(
      screen.getAllByRole("button", { name: /Ir a la diapositiva/ }).length,
    ).toBe(3);
    expect(
      screen.getByRole("heading", { name: "Nuevos lanzamientos" }),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Siguiente imagen" }));

    expect(
      screen.getByRole("heading", { name: "Pasteles para compartir" }),
    ).toBeTruthy();
  });

  it("renders the primary store navigation", () => {
    renderHome();

    expect(
      screen.getByRole("navigation", { name: "Navegación principal" }),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Contacto" })).toBeTruthy();
  });

  it("renders catalog products and updates the cart after a click", () => {
    renderHome();

    expect(screen.getAllByRole("button", { name: "Agregar al carrito" }).length)
      .toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole("button", { name: "Agregar al carrito" })[0]);

    expect(
      screen.getByRole("link", { name: "Carrito de compras, 1 producto" }),
    ).toBeTruthy();
    expect(screen.getByText("Añadido al carrito.")).toBeTruthy();
  });
});
