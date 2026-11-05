import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ContactPage } from "../../pages/ContentPages.jsx";

describe("ContactPage", () => {
  it("updates form values and reports successful submission", () => {
    render(
      React.createElement(
        BrowserRouter,
        null,
        React.createElement(ContactPage),
      ),
    );

    const nameInput = screen.getByLabelText("Nombre completo");
    fireEvent.change(nameInput, { target: { value: "María Pérez" } });
    expect(nameInput.value).toBe("María Pérez");

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "maria@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Mensaje"), {
      target: { value: "Quisiera consultar por una torta." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(screen.getByRole("status").textContent).toBe(
      "Tu mensaje fue registrado. ¡Gracias!",
    );
    expect(nameInput.value).toBe("");
  });
});
