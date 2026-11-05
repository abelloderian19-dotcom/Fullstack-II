import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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
      .sort((a, b) => {
        if (sort === "precio-asc") return a.precio - b.precio;
        if (sort === "precio-desc") return b.precio - a.precio;
        return a.nombre.localeCompare(b.nombre, "es");
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
        <div className="d-flex flex-wrap gap-2">
          <label className="visually-hidden" htmlFor="category-filter">
            Filtrar por categoría
          </label>
          <select
            className="form-select"
            id="category-filter"
            value={category}
            onChange={(event) => updateFilter("categoria", event.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <label className="visually-hidden" htmlFor="sort-products">
            Ordenar productos
          </label>
          <select
            className="form-select"
            id="sort-products"
            value={sort}
            onChange={(event) => updateFilter("orden", event.target.value)}
          >
            <option value="nombre">Nombre</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </div>
      </header>
      {search && (
        <p aria-live="polite">
          Resultados para <strong>“{search}”</strong>
        </p>
      )}
      {filteredProducts.length ? (
        <ProductGrid
          products={filteredProducts}
          ariaLabel="Todos los productos"
        />
      ) : (
        <p className="alert alert-light border" role="status">
          No encontramos productos con esos filtros.
        </p>
      )}
    </main>
  );
}
