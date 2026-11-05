import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { effectivePrice, formatPrice } from "../utils/pricing.js";

export default function ProductDetailPage() {
  const { code: routeCode } = useParams();
  const [searchParams] = useSearchParams();
  const code = routeCode ?? searchParams.get("codigo");
  const { products, addToCart } = useStore();
  const product = products.find((entry) => entry.codigo === code);
  const relatedProducts = products
    .filter(
      (entry) =>
        entry.categoria === product?.categoria &&
        entry.codigo !== product?.codigo,
    )
    .slice(0, 4);
  const [quantity, setQuantity] = useState("1");
  const [feedback, setFeedback] = useState("");

  function submit(event) {
    event.preventDefault();
    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 99) {
      setFeedback("Ingresa una cantidad entre 1 y 99.");
      return;
    }

    setFeedback(
      addToCart(product.codigo, parsedQuantity)
        ? "Añadido al carrito."
        : "No se pudo añadir: revisa el stock y el límite de 99 unidades.",
    );
  }

  if (!product) {
    return (
      <main className="container py-5">
        <p className="alert alert-warning">
          No encontramos ese producto.{" "}
          <Link className="alert-link" to="/productos">
            Volver a productos
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="container py-4 py-lg-5">
      <nav className="small mb-3" aria-label="Ruta de navegación">
        <Link to="/">Inicio</Link>
        <span className="px-1" aria-hidden="true">›</span>
        <Link to="/productos">Productos</Link>
        <span className="px-1" aria-hidden="true">›</span>
        <span aria-current="page">{product.nombre}</span>
      </nav>
      <Link className="btn btn-outline-primary btn-sm mb-3" to="/productos">
        ← Regresar a productos
      </Link>
      <section className="row g-4 g-lg-5">
        <div className="col-12 col-lg-7">
          <div className="ratio ratio-4x3 border overflow-hidden">
            <img
              className="w-100 h-100 object-fit-cover"
              src={product.imagen?.replace(/^\./, "") || "/img/products/imagen_inicio.jpg"}
              alt={product.nombre}
            />
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <p className="text-uppercase small text-secondary mb-1">
            {product.categoria}
          </p>
          <div className="d-flex justify-content-between align-items-start gap-3 border-bottom pb-3 mb-3">
            <h1 className="h2 mb-0">{product.nombre}</h1>
            <strong className="fs-5 text-nowrap">
              {formatPrice(effectivePrice(product))}
            </strong>
          </div>
          {product.descuento > 0 && (
            <p className="text-success">
              Oferta: {product.descuento}% de descuento (antes{" "}
              <del>{formatPrice(product.precio)}</del>).
            </p>
          )}
          <p className="pb-4 mb-4 border-bottom">
            {product.descripcion || "Preparado con ingredientes seleccionados."}
          </p>
          <form className="border-bottom pb-4" onSubmit={submit}>
            <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
              <label className="form-label mb-0" htmlFor="detail-quantity">
                Cantidad
              </label>
              <input
                className="form-control w-auto"
                id="detail-quantity"
                type="number"
                min="1"
                max={Number.isFinite(product.stock) ? Math.min(99, product.stock) : 99}
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
              />
            </div>
            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Agotado" : "Añadir al carrito"}
            </button>
            {feedback && (
              <p className="small text-success mt-2 mb-0" role="status">
                {feedback}
              </p>
            )}
          </form>
        </div>
      </section>
      {relatedProducts.length > 0 && (
        <section className="mt-5 pt-4 border-top" aria-labelledby="related-title">
          <h2 id="related-title" className="h4 mb-3">
            Productos relacionados
          </h2>
          <div className="row g-3">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.codigo} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
