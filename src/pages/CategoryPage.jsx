import { Link, useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid.jsx";
import ProductImage from "../components/ProductImage.jsx";
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
              <ProductImage
                product={products.find((product) => product.categoria === category)}
                className="d-block mx-auto object-fit-cover rounded mb-2"
                width="100"
                height="100"
                alt={"Productos de " + category}
              />
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
            <ProductGrid
              products={selectedProducts}
              ariaLabel={selectedCategory}
            />
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
