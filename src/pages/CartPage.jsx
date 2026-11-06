import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { effectivePrice, formatPrice } from "../utils/pricing.js";
import ActionButton from "../components/ActionButton.jsx";
import CartItemCounter from "../components/CartItemCounter.jsx";
import ProductImage from "../components/ProductImage.jsx";

export default function CartPage() {
  const {
    products,
    cartItems,
    cartTotal,
    addToCart,
    setCartQuantity,
    removeFromCart,
    clearCart,
  } = useStore();
  const [cartMessage, setCartMessage] = useState("");

  function addProduct(product) {
    const added = addToCart(product.codigo);
    setCartMessage(
      added
        ? `${product.nombre} se agregó al carrito.`
        : `No se pudo agregar ${product.nombre}. Revisa el stock disponible.`,
    );
  }

  return (
    <main className="container py-4 py-lg-5">
      <h1 className="h2 text-primary mb-4">Carrito de compras</h1>
      <div className="row g-4 align-items-start">
        <section className="col-12 col-lg-6" aria-labelledby="cart-catalog-title">
          <h2 className="h4 mb-3" id="cart-catalog-title">Lista de productos</h2>
          <p className="visually-hidden" aria-live="polite">{cartMessage}</p>
          <div className="row row-cols-1 row-cols-sm-2 g-3">
            {products.map((product) => (
              <div className="col" key={product.codigo}>
                <article className="card h-100">
                  <ProductImage
                    product={product}
                    className="card-img-top object-fit-cover"
                    width="400"
                    height="300"
                  />
                  <div className="card-body d-flex flex-column">
                    <h3 className="h6 card-title">{product.nombre}</h3>
                    <p className="small text-secondary mb-1">{product.categoria}</p>
                    <p className="mb-2">
                      {product.descuento > 0 && (
                        <del className="small text-secondary me-2">
                          {formatPrice(product.precio)}
                        </del>
                      )}
                      <strong>{formatPrice(effectivePrice(product))}</strong>
                    </p>
                    <p className="small text-secondary mt-auto mb-2">
                      Stock disponible: {product.stock}
                    </p>
                    <ActionButton
                      className="btn btn-primary btn-sm"
                      onClick={() => addProduct(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? "Agotado" : "Agregar"}
                    </ActionButton>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section className="col-12 col-lg-6" aria-labelledby="cart-items-title">
          <h2 className="h4 mb-3" id="cart-items-title">Carrito de compras</h2>
          {cartItems.length === 0 ? (
            <div className="alert alert-light border" role="status">
              Tu carrito está vacío. Agrega productos de la lista para comenzar.
            </div>
          ) : (
            <>
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
                    {cartItems.map(({ codigo, cantidad, product }) => (
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
                              setCartQuantity(codigo, value);
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
                            onClick={() => removeFromCart(codigo)}
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
                      <td colSpan="2"><strong>{formatPrice(cartTotal)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="d-flex flex-wrap justify-content-end gap-2">
                <ActionButton
                  className="btn btn-outline-secondary"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </ActionButton>
                <Link className="btn btn-success" to="/checkout">
                  Comprar ahora
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
