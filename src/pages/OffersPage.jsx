import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../context/StoreContext.jsx";

export default function OffersPage() {
  const { products } = useStore();
  const offers = products.filter(
    (product) => Number.isFinite(product.descuento) && product.descuento > 0,
  );

  return (
    <main className="container py-4">
      <header className="mb-4">
        <p className="text-uppercase small text-secondary mb-1">Promociones</p>
        <h1 className="h2">Ofertas</h1>
        <p>Encuentra tus favoritos a un precio especial.</p>
      </header>
      {offers.length ? (
        <div className="row g-3 g-lg-4">
          {offers.map((product) => (
            <ProductCard key={product.codigo} product={product} />
          ))}
        </div>
      ) : (
        <p className="alert alert-light border" role="status">
          Actualmente no hay productos en oferta.
        </p>
      )}
    </main>
  );
}
