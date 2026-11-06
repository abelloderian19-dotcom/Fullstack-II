import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductImage from "../components/ProductImage.jsx";
import ProductAddToCartForm from "../components/ProductAddToCartForm.jsx";
import RelatedProductsSection from "../components/RelatedProductsSection.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { effectivePrice, formatPrice } from "../utils/pricing.js";

export default function ProductDetailPage() {
  const { code: routeCode } = useParams();
  const [searchParams] = useSearchParams();
  const code = routeCode ?? searchParams.get("codigo");
  const { products } = useStore();
  const product = products.find((entry) => entry.codigo === code);

  if (!product) {
    return (
      <main className="container py-5">
        <p className="alert alert-warning">
          No encontramos ese producto.{" "}
          <Link className="alert-link" to="/productos">Volver a productos</Link>
        </p>
      </main>
    );
  }

  const relatedProducts = products
    .filter((entry) => entry.categoria === product.categoria && entry.codigo !== product.codigo)
    .slice(0, 4);

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
            <ProductImage product={product} className="w-100 h-100 object-fit-cover" />
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <p className="text-uppercase small text-secondary mb-1">{product.categoria}</p>
          <div className="d-flex justify-content-between align-items-start gap-3 border-bottom pb-3 mb-3">
            <h1 className="h2 mb-0">{product.nombre}</h1>
            <strong className="fs-5 text-nowrap">{formatPrice(effectivePrice(product))}</strong>
          </div>
          {product.descuento > 0 && (
            <p className="text-success">
              Oferta: {product.descuento}% de descuento (antes <del>{formatPrice(product.precio)}</del>).
            </p>
          )}
          <p className="pb-4 mb-4 border-bottom">
            {product.descripcion || "Preparado con ingredientes seleccionados."}
          </p>
          <ProductAddToCartForm product={product} />
        </div>
      </section>
      <RelatedProductsSection products={relatedProducts} />
    </main>
  );
}
