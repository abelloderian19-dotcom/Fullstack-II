import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { saveOrder } from "../../data/database.js";
import { AdminOrderDetailPage, AdminOrdersPage } from "../../pages/AdminPages.jsx";

describe("admin order receipt flow", () => {
  beforeEach(() => {
    localStorage.clear();
    saveOrder({
      id: "ORD-TEST",
      fecha: "2026-11-04T12:00:00.000Z",
      estado: "Pagada",
      total: 2500,
      cliente: {
        nombre: "Ana",
        apellidos: "Pérez Soto",
        correo: "ana@example.com",
      },
      envio: {
        calle: "Calle de prueba 123",
        departamento: "",
        region: "Región Metropolitana de Santiago",
        comuna: "Santiago",
        entrega: "estandar",
      },
      pago: "tarjeta",
      items: [
        {
          codigo: "TEST001",
          nombre: "Torta de prueba",
          precio: 2500,
          cantidad: 1,
          subtotal: 2500,
        },
      ],
    });
  });

  it("opens the receipt from the admin orders list", () => {
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/admin/ordenes"] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: "/admin/ordenes",
            element: React.createElement(AdminOrdersPage),
          }),
          React.createElement(Route, {
            path: "/admin/ordenes/:orderId",
            element: React.createElement(AdminOrderDetailPage),
          }),
        ),
      ),
    );

    fireEvent.click(screen.getByRole("link", { name: "Ver boleta" }));

    expect(screen.getByRole("heading", { name: "Boleta ORD-TEST" })).toBeTruthy();
    expect(screen.getByText("Ana Pérez Soto")).toBeTruthy();
    expect(screen.getByText("Torta de prueba")).toBeTruthy();
    expect(screen.getByText("Total: $2.500")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Imprimir boleta" })).toBeTruthy();
  });
});
