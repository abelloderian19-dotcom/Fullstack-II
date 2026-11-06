import { useSearchParams } from "react-router-dom";
import CategoryNavigation from "../components/CategoryNavigation.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
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
      <CategoryNavigation
        categories={categories}
        products={products}
        selectedCategory={selectedCategory}
      />
      {selectedCategory && (
        <section aria-labelledby="selected-category-title">
          <h2 id="selected-category-title" className="h3 mb-3">{selectedCategory}</h2>
          {selectedProducts.length ? (
            <ProductGrid products={selectedProducts} ariaLabel={selectedCategory} />
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
