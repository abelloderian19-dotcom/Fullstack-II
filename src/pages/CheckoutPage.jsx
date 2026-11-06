import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { getRegions, getUsers, saveOrder, updateUser } from "../data/database.js";
import { effectivePrice, formatPrice } from "../utils/pricing.js";
import ProductImage from "../components/ProductImage.jsx";
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
        if (current.region) next.region = validateCheckoutField(name, { ...address, region: value }, regions);
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
              Total a pagar: {formatPrice(payableTotal)}
            </span>
          </header>
          {firstPurchaseDiscountAvailable && (
            <div className="alert alert-success" role="status">
              Tienes 10% de descuento de bienvenida. Se aplica a esta compra: {formatPrice(firstPurchaseDiscount)}.
            </div>
          )}
          {firstPurchaseDiscountAvailable && (
            <p className="d-flex justify-content-between border-top pt-3">
              <span>Subtotal antes del descuento</span><span>{formatPrice(cartTotal)}</span>
            </p>
          )}

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
              <input className={`form-control${fieldErrors.nombre ? " is-invalid" : ""}`} id="checkout-name" name="nombre" value={address.nombre} onChange={updateAddress} onBlur={blurAddressField} required maxLength="50" aria-invalid={Boolean(fieldErrors.nombre)} />
              {fieldErrors.nombre && <div className="invalid-feedback" role="alert">{fieldErrors.nombre}</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-lastname">Apellidos*</label>
              <input className={`form-control${fieldErrors.apellidos ? " is-invalid" : ""}`} id="checkout-lastname" name="apellidos" value={address.apellidos} onChange={updateAddress} onBlur={blurAddressField} required maxLength="100" aria-invalid={Boolean(fieldErrors.apellidos)} />
              {fieldErrors.apellidos && <div className="invalid-feedback" role="alert">{fieldErrors.apellidos}</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-email">Correo*</label>
              <input className={`form-control${fieldErrors.correo ? " is-invalid" : ""}`} id="checkout-email" type="email" name="correo" value={address.correo} onChange={updateAddress} onBlur={blurAddressField} required aria-invalid={Boolean(fieldErrors.correo)} />
              {fieldErrors.correo && <div className="invalid-feedback" role="alert">{fieldErrors.correo}</div>}
            </div>

            <div className="col-12 mt-4">
              <h2 className="h5 mb-0">Dirección de entrega</h2>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-street">Calle y número*</label>
              <input className={`form-control${fieldErrors.calle ? " is-invalid" : ""}`} id="checkout-street" name="calle" value={address.calle} onChange={updateAddress} onBlur={blurAddressField} required maxLength="200" aria-invalid={Boolean(fieldErrors.calle)} />
              {fieldErrors.calle && <div className="invalid-feedback" role="alert">{fieldErrors.calle}</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-department">Departamento</label>
              <input className={`form-control${fieldErrors.departamento ? " is-invalid" : ""}`} id="checkout-department" name="departamento" value={address.departamento} onChange={updateAddress} onBlur={blurAddressField} maxLength="50" aria-invalid={Boolean(fieldErrors.departamento)} />
              {fieldErrors.departamento && <div className="invalid-feedback" role="alert">{fieldErrors.departamento}</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-region">Región*</label>
              <select className={`form-select${fieldErrors.region ? " is-invalid" : ""}`} id="checkout-region" name="region" value={address.region} onChange={updateAddress} onBlur={blurAddressField} required aria-invalid={Boolean(fieldErrors.region)}>
                <option value="">Selecciona una región</option>
                {regions.map((region) => <option key={region.nombre}>{region.nombre}</option>)}
              </select>
              {fieldErrors.region && <div className="invalid-feedback" role="alert">{fieldErrors.region}</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="checkout-commune">Comuna*</label>
              <select className={`form-select${fieldErrors.comuna ? " is-invalid" : ""}`} id="checkout-commune" name="comuna" value={address.comuna} onChange={updateAddress} onBlur={blurAddressField} required disabled={!selectedRegion} aria-invalid={Boolean(fieldErrors.comuna)}>
                <option value="">Selecciona una comuna</option>
                {selectedRegion?.comunas.map((commune) => <option key={commune}>{commune}</option>)}
              </select>
              {fieldErrors.comuna && <div className="invalid-feedback" role="alert">{fieldErrors.comuna}</div>}
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="checkout-notes">Indicaciones para la entrega</label>
              <textarea className={`form-control${fieldErrors.indicaciones ? " is-invalid" : ""}`} id="checkout-notes" name="indicaciones" value={address.indicaciones} onChange={updateAddress} onBlur={blurAddressField} rows="3" maxLength="500" aria-invalid={Boolean(fieldErrors.indicaciones)} />
              {fieldErrors.indicaciones && <div className="invalid-feedback" role="alert">{fieldErrors.indicaciones}</div>}
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
                Pagar ahora {formatPrice(payableTotal)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
