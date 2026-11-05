import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage.jsx";

describe("HomePage", () => {
  it("renders the store introduction and product link", () => {
    render(React.createElement(HomePage));

    expect(
      screen.getByRole("heading", {
        name: "Dulces momentos, hechos para compartir.",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Ver productos" }).getAttribute("href"),
    ).toBe("./productos.html");
  });

  it("renders the primary store navigation", () => {
    render(React.createElement(HomePage));

    expect(
      screen.getByRole("navigation", { name: "Navegación principal" }),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Contacto" })).toBeTruthy();
  });
});
