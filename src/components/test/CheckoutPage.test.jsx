import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StoreProvider } from "../../context/StoreContext.jsx";
import { getProducts, getRegions } from "../../data/database.js";
import CheckoutPage from "../../pages/CheckoutPage.jsx";
import PaymentResultPage from "../../pages/PaymentResultPage.jsx";

const region = getRegions().find(({ nombre }) =>
  nombre.includes("Metropolitana"),
).nombre;

function renderCheckout() {
  const firstProduct = getProducts()[0];
  localStorage.setItem(
    "pasteleria-carrito",
    JSON.stringify([{ codigo: firstProduct.codigo, cantidad: 1 }]),
  );

  render(
    React.createElement(
      StoreProvider,
      null,
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/checkout"] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: "/checkout",
            element: React.createElement(CheckoutPage),
          }),
          React.createElement(Route, {
            path: "/pago/:result/:orderId",
            element: React.createElement(PaymentResultPage),
          }),
        ),
      ),
    ),
  );
}

function completeShippingForm() {
  fireEvent.change(screen.getByLabelText("Nombre*"), {
    target: { value: "María" },
  });
  fireEvent.change(screen.getByLabelText("Apellidos*"), {
    target: { value: "Pérez" },
  });
  fireEvent.change(screen.getByLabelText("Correo*"), {
    target: { value: "maria@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Calle y número*"), {
    target: { value: "Calle de prueba 123" },
  });
  fireEvent.change(screen.getByLabelText("Región*"), {
    target: { value: region },
  });
  fireEvent.change(screen.getByLabelText("Comuna*"), {
    target: { value: "Santiago" },
  });
}

describe("checkout", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("creates a paid order and empties the cart", () => {
    const stockBeforePurchase = getProducts()[0].stock;
    renderCheckout();
    completeShippingForm();
    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));

    expect(screen.getByRole("heading", { name: /Se ha realizado la compra/ }))
      .toBeTruthy();
    expect(screen.getByText("Total pagado: $40.500")).toBeTruthy();
    expect(localStorage.getItem("pasteleria-carrito")).toBe("[]");
    expect(getProducts()[0].stock).toBe(stockBeforePurchase - 1);
  });

  it("shows a declined payment and keeps the cart for retry", () => {
    const stockBeforePurchase = getProducts()[0].stock;
    renderCheckout();
    completeShippingForm();
    fireEvent.click(screen.getByLabelText("Simular rechazo del pago (solo demostración)"));
    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));

    expect(screen.getByRole("heading", { name: /No se pudo realizar el pago/ }))
      .toBeTruthy();
    expect(screen.getByRole("link", { name: "Volver a realizar el pago" }))
      .toBeTruthy();
    expect(localStorage.getItem("pasteleria-carrito")).toContain("TC001");
    expect(getProducts()[0].stock).toBe(stockBeforePurchase);
  });
});
