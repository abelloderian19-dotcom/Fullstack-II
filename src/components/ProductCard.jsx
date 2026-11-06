import { Link } from "react-router-dom";
import { effectivePrice, formatPrice } from "../utils/pricing.js";
import AddToCartButton from "./AddToCartButton.jsx";
import ProductImage from "./ProductImage.jsx";

export default function ProductCard({ product }) {
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
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
