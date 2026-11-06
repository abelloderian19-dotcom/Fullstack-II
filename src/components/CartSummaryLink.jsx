import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

export default function CartSummaryLink() {
  const { cartCount } = useStore();
  const previousCartCount = useRef(cartCount);
  const [cartUpdated, setCartUpdated] = useState(false);

  useEffect(() => {
    if (previousCartCount.current === cartCount) return undefined;

    previousCartCount.current = cartCount;
    setCartUpdated(true);
    const timeout = window.setTimeout(() => setCartUpdated(false), 550);
    return () => window.clearTimeout(timeout);
  }, [cartCount]);

  return (
    <Link
      className={
        "navbar-cart d-flex align-items-center gap-2 text-decoration-none text-nowrap" +
        (cartUpdated ? " is-updating" : "")
      }
      to="/carrito"
      aria-label={`Carrito de compras, ${cartCount} ${cartCount === 1 ? "producto" : "productos"}`}
    >
      <span className="navbar-cart-icon" aria-hidden="true">🛒</span>
      <span className="navbar-cart-label">Carrito</span>
      <span className="navbar-cart-count" aria-live="polite">{cartCount}</span>
    </Link>
  );
}
