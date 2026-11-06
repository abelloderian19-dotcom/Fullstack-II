import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm.jsx";
import CheckoutOrderSummary from "../components/CheckoutOrderSummary.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { getRegions, getUsers, saveOrder, updateUser } from "../data/database.js";
import { effectivePrice, formatPrice } from "../utils/pricing.js";
import { validateCheckoutDetails, validateCheckoutField } from "../utils/validators.js";

const blankAddress = {
  nombre: "",
  apellidos: "",
  correo: "",
  calle: "",
  departamento: "",
  region: "",
  comuna: "",
  indicaciones: "",
  entrega: "estandar",
  pago: "tarjeta",
};

function getCustomerDefaults() {
  try {
    const customer = JSON.parse(sessionStorage.getItem("usuarioActual") ?? "null");
    if (!customer) return blankAddress;

    return {
      ...blankAddress,
      nombre: customer.nombre ?? "",
      apellidos: customer.apellidos ?? "",
      correo: customer.correo ?? "",
      calle: customer.direccion ?? "",
      region: customer.region ?? "",
      comuna: customer.comuna ?? "",
    };
  } catch {
    return blankAddress;
  }
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, completePurchase } = useStore();
  const navigate = useNavigate();
  const regions = getRegions();
  const [address, setAddress] = useState(getCustomerDefaults);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  let activeCustomer = null;
  try {
    activeCustomer = JSON.parse(sessionStorage.getItem("usuarioActual") ?? "null");
  } catch {
    activeCustomer = null;
  }
  const savedCustomer = activeCustomer?.run
    ? getUsers().find((user) => user.run === activeCustomer.run)
    : null;
  const firstPurchaseDiscountAvailable = savedCustomer?.descuentoPrimeraCompraDisponible === true;
  const firstPurchaseDiscount = firstPurchaseDiscountAvailable
    ? cartItems.reduce((sum, item) => {
        const subtotal = effectivePrice(item.product) * item.cantidad;
        return sum + subtotal - Math.round(subtotal * 0.9);
      }, 0)
    : 0;
  const payableTotal = cartTotal - firstPurchaseDiscount;
  const selectedRegion = useMemo(
    () => regions.find((region) => region.nombre === address.region),
    [address.region, regions],
  );

  function updateAddress(event) {
    const { name, value } = event.target;
    setAddress((current) => ({
      ...current,
      [name]: value,
      ...(name === "region" ? { comuna: "" } : {}),
    }));
    setFieldErrors((current) => {
      const next = { ...current };
      if (name === "region") {
        delete next.comuna;
        if (current.region) {
          next.region = validateCheckoutField(name, { ...address, region: value }, regions);
        }
      } else if (Object.prototype.hasOwnProperty.call(current, name)) {
        next[name] = validateCheckoutField(name, { ...address, [name]: value }, regions);
      }
      return next;
    });
  }

  function blurAddressField(event) {
    const { name, value } = event.target;
    setFieldErrors((current) => ({
      ...current,
      [name]: validateCheckoutField(name, { ...address, [name]: value }, regions),
    }));
  }

  function createOrder() {
    const orderId = `ORD-${Date.now()}`;
    return {
      id: orderId,
      fecha: new Date().toISOString(),
      estado: simulateFailure ? "Pago rechazado" : "Pagada",
      subtotal: cartTotal,
      descuentoPrimeraCompra: firstPurchaseDiscount,
      total: payableTotal,
      cliente: {
        run: activeCustomer?.run ?? null,
        nombre: address.nombre.trim(),
        apellidos: address.apellidos.trim(),
        correo: address.correo.trim(),
      },
      envio: {
        calle: address.calle.trim(),
        departamento: address.departamento.trim(),
        region: address.region,
        comuna: address.comuna,
        indicaciones: address.indicaciones.trim(),
        entrega: address.entrega,
      },
      pago: address.pago,
      items: cartItems.map(({ codigo, cantidad, product }) => {
        const itemSubtotal = effectivePrice(product) * cantidad;
        const itemDiscount = firstPurchaseDiscountAvailable
          ? itemSubtotal - Math.round(itemSubtotal * 0.9)
          : 0;
        return {
          codigo,
          nombre: product.nombre,
          precio: effectivePrice(product),
          cantidad,
          subtotal: itemSubtotal - itemDiscount,
        };
      }),
    };
  }

  function submitCheckout(event) {
    event.preventDefault();
    setError("");
    if (cartItems.length === 0) {
      setError("Agrega al menos un producto antes de continuar.");
      return;
    }

    const validationError = validateCheckoutDetails(address, regions);
    if (validationError) {
      setError(validationError);
      return;
    }

    const unavailableItem = cartItems.find(
      ({ cantidad, product }) => Number.isFinite(product.stock) && cantidad > product.stock,
    );
    if (unavailableItem) {
      setError(`No hay stock suficiente para ${unavailableItem.product.nombre}.`);
      return;
    }

    const order = createOrder();
    try {
      if (simulateFailure) {
        saveOrder(order);
      } else {
        completePurchase(order);
        if (firstPurchaseDiscountAvailable && activeCustomer?.run) {
          const updatedCustomer = updateUser(activeCustomer.run, {
            descuentoPrimeraCompraDisponible: false,
          });
          const { password: _password, ...sessionCustomer } = updatedCustomer;
          sessionStorage.setItem("usuarioActual", JSON.stringify(sessionCustomer));
        }
      }
    } catch (purchaseError) {
      setError(purchaseError.message);
      return;
    }
    navigate(`/pago/${simulateFailure ? "error" : "exitoso"}/${order.id}`);
  }

  if (cartItems.length === 0) {
    return (
      <main className="container py-5">
        <div className="alert alert-light border">
          No hay productos para pagar.{" "}
          <Link to="/productos">Volver al catálogo</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <div className="checkout-panel card shadow-sm mx-auto">
        <div className="card-body p-3 p-md-4">
          <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div>
              <h1 className="h3 mb-1">Carrito de compra</h1>
              <p className="text-secondary mb-0">Completa la información para finalizar tu pedido.</p>
            </div>
            <span className="badge text-bg-primary fs-6">Total a pagar: {formatPrice(payableTotal)}</span>
          </header>
          {firstPurchaseDiscountAvailable && (
            <div className="alert alert-success" role="status">
              Tienes 10% de descuento de bienvenida. Se aplica a esta compra: {formatPrice(firstPurchaseDiscount)}.
            </div>
          )}
          <CheckoutOrderSummary
            items={cartItems}
            subtotal={cartTotal}
            discount={firstPurchaseDiscount}
          />
          <CheckoutForm
            address={address}
            errors={fieldErrors}
            regions={regions}
            selectedRegion={selectedRegion}
            simulateFailure={simulateFailure}
            error={error}
            submitLabel={`Pagar ahora ${formatPrice(payableTotal)}`}
            onAddressChange={updateAddress}
            onAddressBlur={blurAddressField}
            onFailureChange={setSimulateFailure}
            onSubmit={submitCheckout}
          />
        </div>
      </div>
    </main>
  );
}
