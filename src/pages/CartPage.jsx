import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { effectivePrice, formatPrice } from "../utils/pricing.js";

export default function CartPage() {
  const { cartItems, cartTotal, setCartQuantity, removeFromCart, clearCart } =
    useStore();

  return (
    <main className="container py-4 py-lg-5">
      <h1 className="h2 text-primary mb-4">Mi carrito de compras</h1>
      {cartItems.length === 0 ? (
        <section className="card">
          <div className="card-body text-center py-5">
            <p className="h5">Tu carrito está vacío.</p>
            <Link className="btn btn-primary" to="/productos">
              Ver productos
            </Link>
          </div>
        </section>
      ) : (
        <div className="row g-4">
          <section className="col-12 col-lg-8" aria-label="Productos del carrito">
            <ul className="list-group list-group-flush">
              {cartItems.map(({ codigo, cantidad, product }) => (
                <li
                  className="cart-product-item list-group-item d-flex flex-wrap align-items-center gap-3 p-3"
                  key={codigo}
                >
                  <img
                    className="rounded border object-fit-cover"
                    src={product.imagen?.replace(/^\./, "") || "/img/products/imagen_inicio.jpg"}
                    alt={product.nombre}
                    width="76"
                    height="70"
                  />
                  <div className="flex-grow-1">
                    <Link
                      className="fw-semibold text-decoration-none"
                      to={`/producto/${encodeURIComponent(codigo)}`}
                    >
                      {product.nombre}
                    </Link>
                    <small className="d-block text-secondary">
                      {formatPrice(effectivePrice(product))} por unidad
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      type="button"
                      aria-label={`Reducir cantidad de ${product.nombre}`}
                      disabled={cantidad <= 1}
                      onClick={() => setCartQuantity(codigo, cantidad - 1)}
                    >
                      −
                    </button>
                    <span aria-label={`${cantidad} unidades`}>{cantidad}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      type="button"
                      aria-label={`Aumentar cantidad de ${product.nombre}`}
                      disabled={cantidad >= Math.min(99, product.stock ?? 99)}
                      onClick={() => setCartQuantity(codigo, cantidad + 1)}
                    >
                      +
                    </button>
                  </div>
                  <strong className="text-nowrap">
                    {formatPrice(effectivePrice(product) * cantidad)}
                  </strong>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    type="button"
                    aria-label={`Quitar ${product.nombre} del carrito`}
                    onClick={() => removeFromCart(codigo)}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="btn btn-outline-danger mt-3"
              type="button"
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
          </section>
          <aside className="col-12 col-lg-4" aria-label="Resumen de compra">
            <div className="card">
              <div className="card-body p-3 p-md-4">
                <h2 className="h5 text-primary mb-3">Resumen</h2>
                <p className="d-flex justify-content-between gap-3 border-top pt-3 mb-4">
                  <span>Total:</span>
                  <strong>{formatPrice(cartTotal)}</strong>
                </p>
                <Link className="btn btn-primary w-100" to="/checkout">
                  Continuar compra
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
