import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { getRegions, saveOrder } from "../data/database.js";
import { effectivePrice, formatPrice } from "../utils/pricing.js";
import ProductImage from "../components/ProductImage.jsx";
import { validateCheckoutDetails } from "../utils/validators.js";

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
  const session = sessionStorage.getItem("usuarioActual");
  if (!session) return blankAddress;

  const customer = JSON.parse(session);
  return {
    ...blankAddress,
    nombre: customer.nombre ?? "",
    apellidos: customer.apellidos ?? "",
    correo: customer.correo ?? "",
    calle: customer.direccion ?? "",
    region: customer.region ?? "",
    comuna: customer.comuna ?? "",
  };
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, completePurchase } = useStore();
  const navigate = useNavigate();
  const regions = getRegions();
  const [address, setAddress] = useState(getCustomerDefaults);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [error, setError] = useState("");
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
      ({ cantidad, product }) =>
        Number.isFinite(product.stock) && cantidad > product.stock,
    );
    if (unavailableItem) {
      setError(`No hay stock suficiente para ${unavailableItem.product.nombre}.`);
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    const order = {
      id: orderId,
      fecha: new Date().toISOString(),
      estado: simulateFailure ? "Pago rechazado" : "Pagada",
      total: cartTotal,
      cliente: {
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
      items: cartItems.map(({ codigo, cantidad, product }) => ({
        codigo,
        nombre: product.nombre,
        precio: effectivePrice(product),
        cantidad,
        subtotal: effectivePrice(product) * cantidad,
      })),
    };

    try {
      if (simulateFailure) {
        saveOrder(order);
      } else {
        completePurchase(order);
      }
    } catch (purchaseError) {
      setError(purchaseError.message);
      return;
    }
    navigate(`/pago/${simulateFailure ? "error" : "exitoso"}/${orderId}`);
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
              <p className="text-secondary mb-0">
                Completa la información para finalizar tu pedido.
              </p>
            </div>
            <span className="badge text-bg-primary fs-6">
              Total a pagar: {formatPrice(cartTotal)}
            </span>
          </header>

          <div className="table-responsive mb-4">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(({ codigo, cantidad, product }) => (
                  <tr key={codigo}>
                    <td>
                      <ProductImage
                        product={product}
                        alt=""
                        className="object-fit-cover"
                        width="48"
                        height="48"
                      />
                    </td>
                    <td>{product.nombre}</td>
                    <td>{formatPrice(effectivePrice(product))}</td>
                    <td>{cantidad}</td>
                    <td>{formatPrice(effectivePrice(product) * cantidad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form className="row g-3" onSubmit={submitCheckout} noValidate>
            <div className="col-12">
              <h2 className="h5 mb-0">Información del cliente</h2>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-name">Nombre*</label>
              <input className="form-control" id="checkout-name" name="nombre" value={address.nombre} onChange={updateAddress} required maxLength="50" />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-lastname">Apellidos*</label>
              <input className="form-control" id="checkout-lastname" name="apellidos" value={address.apellidos} onChange={updateAddress} required maxLength="100" />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-email">Correo*</label>
              <input className="form-control" id="checkout-email" type="email" name="correo" value={address.correo} onChange={updateAddress} required />
            </div>

            <div className="col-12 mt-4">
              <h2 className="h5 mb-0">Dirección de entrega</h2>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-street">Calle y número*</label>
              <input className="form-control" id="checkout-street" name="calle" value={address.calle} onChange={updateAddress} required maxLength="200" />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-department">Departamento</label>
              <input className="form-control" id="checkout-department" name="departamento" value={address.departamento} onChange={updateAddress} maxLength="50" />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-region">Región*</label>
              <select className="form-select" id="checkout-region" name="region" value={address.region} onChange={updateAddress} required>
                <option value="">Selecciona una región</option>
                {regions.map((region) => <option key={region.nombre}>{region.nombre}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-commune">Comuna*</label>
              <select className="form-select" id="checkout-commune" name="comuna" value={address.comuna} onChange={updateAddress} required disabled={!selectedRegion}>
                <option value="">Selecciona una comuna</option>
                {selectedRegion?.comunas.map((commune) => <option key={commune}>{commune}</option>)}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="checkout-notes">Indicaciones para la entrega</label>
              <textarea className="form-control" id="checkout-notes" name="indicaciones" value={address.indicaciones} onChange={updateAddress} rows="3" maxLength="500" />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-delivery">Opción de entrega</label>
              <select className="form-select" id="checkout-delivery" name="entrega" value={address.entrega} onChange={updateAddress}>
                <option value="estandar">Entrega estándar (2 a 3 días) — sin costo</option>
                <option value="express">Entrega express (día siguiente)</option>
                <option value="retiro">Retiro en tienda</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-payment">Medio de pago</label>
              <select className="form-select" id="checkout-payment" name="pago" value={address.pago} onChange={updateAddress}>
                <option value="tarjeta">Tarjeta (demostración)</option>
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo al recibir</option>
              </select>
            </div>
            <div className="col-12">
              <div className="form-check">
                <input className="form-check-input" id="simulate-payment-failure" type="checkbox" checked={simulateFailure} onChange={(event) => setSimulateFailure(event.target.checked)} />
                <label className="form-check-label" htmlFor="simulate-payment-failure">
                  Simular rechazo del pago (solo demostración)
                </label>
              </div>
            </div>
            {error && <p className="col-12 text-danger mb-0" role="alert">{error}</p>}
            <div className="col-12 d-flex justify-content-end">
              <button className="btn btn-success" type="submit">
                Pagar ahora {formatPrice(cartTotal)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
