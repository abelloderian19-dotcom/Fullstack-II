import { Link } from "react-router-dom";
import { effectivePrice, formatPrice } from "../utils/pricing.js";
import ActionButton from "./ActionButton.jsx";
import CartItemCounter from "./CartItemCounter.jsx";
import ProductImage from "./ProductImage.jsx";

export default function CartItemsTable({
  items,
  total,
  setQuantity,
  removeItem,
  clear,
}) {
  if (items.length === 0) {
    return (
      <section className="col-12 col-lg-6" aria-labelledby="cart-items-title">
        <h2 className="h4 mb-3" id="cart-items-title">Carrito de compras</h2>
        <div className="alert alert-light border" role="status">
          Tu carrito está vacío. Agrega productos de la lista para comenzar.
        </div>
      </section>
    );
  }

  return (
    <section className="col-12 col-lg-6" aria-labelledby="cart-items-title">
      <h2 className="h4 mb-3" id="cart-items-title">Carrito de compras</h2>
      <div className="table-responsive">
        <table className="table table-sm table-striped align-middle">
          <thead>
            <tr>
              <th scope="col">Imagen</th>
              <th scope="col">Nombre</th>
              <th scope="col">Precio</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Subtotal</th>
              <th scope="col"><span className="visually-hidden">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ codigo, cantidad, product }) => (
              <tr key={codigo}>
                <td>
                  <ProductImage
                    product={product}
                    className="rounded object-fit-cover"
                    width="48"
                    height="42"
                  />
                </td>
                <th scope="row" className="small">{product.nombre}</th>
                <td className="text-nowrap">{formatPrice(effectivePrice(product))}</td>
                <td>
                  <CartItemCounter
                    clicks={cantidad}
                    setClicks={(nextQuantity) => {
                      const value = typeof nextQuantity === "function"
                        ? nextQuantity(cantidad)
                        : nextQuantity;
                      setQuantity(codigo, value);
                    }}
                    maxClicks={Math.min(99, product.stock ?? 99)}
                    productName={product.nombre}
                  />
                </td>
                <td className="text-nowrap">
                  {formatPrice(effectivePrice(product) * cantidad)}
                </td>
                <td>
                  <ActionButton
                    className="btn btn-outline-danger btn-sm"
                    aria-label={`Quitar ${product.nombre} del carrito`}
                    onClick={() => removeItem(codigo)}
                  >
                    Eliminar
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan="4" className="text-end">Total</th>
              <td colSpan="2"><strong>{formatPrice(total)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="d-flex flex-wrap justify-content-end gap-2">
        <ActionButton className="btn btn-outline-secondary" onClick={clear}>
          Vaciar carrito
        </ActionButton>
        <Link className="btn btn-success" to="/checkout">Comprar ahora</Link>
      </div>
    </section>
  );
}
