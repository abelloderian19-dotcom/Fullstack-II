export default function ProductCatalogFilters({ categories, category, sort, onChange }) {
  return (
    <div className="d-flex flex-wrap gap-2">
      <label className="visually-hidden" htmlFor="category-filter">
        Filtrar por categoría
      </label>
      <select
        className="form-select"
        id="category-filter"
        value={category}
        onChange={(event) => onChange("categoria", event.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <label className="visually-hidden" htmlFor="sort-products">Ordenar productos</label>
      <select
        className="form-select"
        id="sort-products"
        value={sort}
        onChange={(event) => onChange("orden", event.target.value)}
      >
        <option value="nombre">Nombre</option>
        <option value="precio-asc">Precio: menor a mayor</option>
        <option value="precio-desc">Precio: mayor a menor</option>
      </select>
    </div>
  );
}
