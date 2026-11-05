import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../context/StoreContext.jsx";

export default function HomePage() {
  const { products, categories } = useStore();

  return (
    <main className="container py-3">
        <section
          className="row align-items-center g-0 my-3 bg-secondary-subtle"
          aria-labelledby="home-title"
        >
          <div className="col-12 col-md-5 p-4 p-lg-5">
            <h1 id="home-title" className="display-5 text-primary mb-3">
              Dulces momentos, hechos para compartir.
            </h1>
            <p className="lh-lg mb-4">
              Tortas y postres preparados con dedicación para acompañar tus
              celebraciones y convertir cualquier día en una ocasión especial.
            </p>
            <Link to="/productos" className="btn btn-primary">
              Ver productos
            </Link>
          </div>
          <div className="col-12 col-md-7 p-3">
            <div className="ratio ratio-16x9 border border-dark">
              <img
                className="w-100 h-100 object-fit-cover"
                src="/img/products/imagen_inicio.jpg"
                alt="Pasteles y postres de Pastelería 1000 Sabores"
              />
            </div>
          </div>
        </section>
        <section className="mb-5 text-center" aria-labelledby="migration-title">
          <h2 id="migration-title" className="h4 text-uppercase mb-3">
            Los más recomendados
          </h2>
          <div className="row g-3 g-lg-4 text-start mb-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.codigo} product={product} />
            ))}
          </div>
          <h2 className="h4 text-uppercase mb-3">Compra por categoría</h2>
          <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
            {categories.slice(0, 4).map((category) => (
              <div className="col" key={category}>
                <Link
                  className="btn btn-light border w-100 h-100 py-3"
                  to={`/categorias?nombre=${encodeURIComponent(category)}`}
                >
                  {category}
                </Link>
              </div>
            ))}
          </div>
          <Link to="/productos" className="btn btn-outline-primary">
            Explorar catálogo
          </Link>
        </section>
    </main>
  );
}
