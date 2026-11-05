import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../context/StoreContext.jsx";

export default function CategoryPage() {
  const { categories, products } = useStore();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("nombre") ?? "";
  const selectedProducts = products.filter(
    (product) => product.categoria === selectedCategory,
  );

  return (
    <main className="container py-4">
      <h1 className="h2 text-center mb-4">Categorías</h1>
      <nav className="row row-cols-2 row-cols-md-4 g-3 mb-5" aria-label="Categorías de productos">
        {categories.map((category) => (
          <div className="col" key={category}>
            <Link
              className={`card h-100 text-decoration-none text-center p-3 ${category === selectedCategory ? "border-primary" : ""}`}
              to={`/categorias?nombre=${encodeURIComponent(category)}`}
              aria-current={category === selectedCategory ? "page" : undefined}
            >
              <span className="ratio ratio-4x3 mb-2">
                <img
                  className="object-fit-cover"
                  src="/img/products/imagen_inicio.jpg"
                  alt=""
                  loading="lazy"
                />
              </span>
              <span className="fw-semibold">{category}</span>
            </Link>
          </div>
        ))}
      </nav>
      {selectedCategory && (
        <section aria-labelledby="selected-category-title">
          <h2 id="selected-category-title" className="h3 mb-3">
            {selectedCategory}
          </h2>
          {selectedProducts.length ? (
            <div className="row g-3 g-lg-4">
              {selectedProducts.map((product) => (
                <ProductCard key={product.codigo} product={product} />
              ))}
            </div>
          ) : (
            <p className="alert alert-light border" role="status">
              Esta categoría aún no tiene productos disponibles.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
