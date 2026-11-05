import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "../../pages/AuthPages.jsx";

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("shows an error only after an unsuccessful sign-in", () => {
    render(
      React.createElement(
        BrowserRouter,
        null,
        React.createElement(LoginPage),
      ),
    );

    expect(screen.queryByRole("alert")).toBeNull();
    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "unknown@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    expect(screen.getByRole("alert").textContent).toBe(
      "Correo o contraseña incorrectos.",
    );
  });
});
