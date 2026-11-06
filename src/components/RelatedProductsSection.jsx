import ProductGrid from "./ProductGrid.jsx";

export default function RelatedProductsSection({ products }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-5 pt-4 border-top" aria-labelledby="related-title">
      <h2 id="related-title" className="h4 mb-3">Productos relacionados</h2>
      <ProductGrid
        products={products}
        className="row g-3"
        ariaLabel="Productos relacionados"
      />
    </section>
  );
}
