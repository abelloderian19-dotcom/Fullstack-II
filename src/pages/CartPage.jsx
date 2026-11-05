import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { effectivePrice, formatPrice } from "../utils/pricing.js";
import ActionButton from "../components/ActionButton.jsx";
import CartItemCounter from "../components/CartItemCounter.jsx";
import ProductImage from "../components/ProductImage.jsx";

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
              {cartItems.map(({ codigo, cantidad, product }) => {
                const setClicks = (updateClicks) => {
                  const valorClicks =
                    typeof updateClicks === "function"
                      ? updateClicks(cantidad)
                      : updateClicks;
                  setCartQuantity(codigo, valorClicks);
                };

                return (
                  <li
                    className="cart-product-item list-group-item d-flex flex-wrap align-items-center gap-3 p-3"
                    key={codigo}
                  >
                    <ProductImage
                      product={product}
                      className="rounded border object-fit-cover"
                      width="76"
                      height="70"
                    />
                    <div className="flex-grow-1">
                      <Link
                        className="fw-semibold text-decoration-none"
                        to={"/producto/" + encodeURIComponent(codigo)}
                      >
                        {product.nombre}
                      </Link>
                      <small className="d-block text-secondary">
                        {formatPrice(effectivePrice(product))} por unidad
                      </small>
                    </div>
                    <CartItemCounter
                      clicks={cantidad}
                      setClicks={setClicks}
                      maxClicks={Math.min(99, product.stock ?? 99)}
                      productName={product.nombre}
                    />
                    <strong className="text-nowrap">
                      {formatPrice(effectivePrice(product) * cantidad)}
                    </strong>
                    <ActionButton
                      className="btn btn-outline-danger btn-sm"
                      aria-label={"Quitar " + product.nombre + " del carrito"}
                      onClick={() => removeFromCart(codigo)}
                    >
                      Quitar
                    </ActionButton>
                  </li>
                );
              })}
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
