import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { effectivePrice, formatPrice } from "../utils/pricing.js";
import ActionButton from "./ActionButton.jsx";
import ProductImage from "./ProductImage.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useStore();
  const [feedback, setFeedback] = useState("");
  const [hasError, setHasError] = useState(false);

  function addProduct() {
    const added = addToCart(product.codigo);
    setHasError(!added);
    setFeedback(
      added
        ? "Añadido al carrito."
        : "No se pudo añadir: revisa el stock y el límite de 99 unidades.",
    );
  }

  return (
    <article className="col-12 col-sm-6 col-lg-3">
      <div className="card h-100 border-secondary-subtle">
        <Link
          className="text-dark text-decoration-none"
          to={`/producto/${encodeURIComponent(product.codigo)}`}
          aria-label={`Ver detalle de ${product.nombre}`}
        >
          <div className="ratio ratio-4x3 overflow-hidden">
            <ProductImage
              product={product}
              className="w-100 h-100 object-fit-cover"
              width="600"
              height="400"
            />
          </div>
          <h3 className="h6 text-center text-primary mb-0 p-2">
            {product.nombre}
          </h3>
        </Link>
        <div className="card-body p-2 d-flex flex-column align-items-center">
          {product.descuento > 0 && (
            <span className="badge text-bg-danger mb-1">
              {product.descuento}% de descuento
            </span>
          )}
          <p className="fw-semibold text-primary mb-2">
            {product.descuento > 0 && (
              <del className="small text-secondary me-2">
                {formatPrice(product.precio)}
              </del>
            )}
            {formatPrice(effectivePrice(product))}
          </p>
          <ActionButton
            className="btn btn-primary btn-sm"
            onClick={addProduct}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Agotado" : "Agregar al carrito"}
          </ActionButton>
          {feedback && (
            <p
              className={`small mt-2 mb-0 text-center ${hasError ? "text-danger" : "text-success"}`}
              role="status"
              aria-live="polite"
            >
              {feedback}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
