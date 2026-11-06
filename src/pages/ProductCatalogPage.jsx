import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCatalogFilters from "../components/ProductCatalogFilters.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { useStore } from "../context/StoreContext.jsx";

export default function ProductCatalogPage() {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const category = searchParams.get("categoria") ?? "";
  const sort = searchParams.get("orden") ?? "nombre";

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    return products
      .filter(
        (product) =>
          (!category || product.categoria === category) &&
          (!query ||
            `${product.nombre} ${product.descripcion} ${product.codigo}`
              .toLocaleLowerCase("es")
              .includes(query)),
      )
      .sort((first, second) => {
        if (sort === "precio-asc") return first.precio - second.precio;
        if (sort === "precio-desc") return second.precio - first.precio;
        return first.nombre.localeCompare(second.nombre, "es");
      });
  }, [category, products, search, sort]);

  function updateFilter(key, value) {
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set(key, value);
    else nextParams.delete(key);
    setSearchParams(nextParams);
  }

  return (
    <main className="container py-4">
      <header className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <p className="text-uppercase small text-secondary mb-1">Catálogo</p>
          <h1 className="h2 mb-0">Nuestros productos</h1>
        </div>
        <ProductCatalogFilters
          categories={categories}
          category={category}
          sort={sort}
          onChange={updateFilter}
        />
      </header>
      {search && <p aria-live="polite">Resultados para <strong>“{search}”</strong></p>}
      {filteredProducts.length ? (
        <ProductGrid products={filteredProducts} ariaLabel="Todos los productos" />
      ) : (
        <p className="alert alert-light border" role="status">
          No encontramos productos con esos filtros.
        </p>
      )}
    </main>
  );
}
