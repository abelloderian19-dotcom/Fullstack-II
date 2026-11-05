import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({
  products,
  className = "row g-3 g-lg-4",
  ariaLabel,
}) {
  return (
    <section className={className} aria-label={ariaLabel}>
      {products.map((product) => (
        <ProductCard key={product.codigo} product={product} />
      ))}
    </section>
  );
}
