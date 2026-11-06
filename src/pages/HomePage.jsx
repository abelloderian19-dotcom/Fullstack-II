import { Link } from "react-router-dom";
import HomeCarousel from "../components/HomeCarousel.jsx";
import HomeCategoryLinks from "../components/HomeCategoryLinks.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { useStore } from "../context/StoreContext.jsx";

export default function HomePage() {
  const { products, categories } = useStore();

  return (
    <main className="home-page py-3">
      <HomeCarousel />
      <section className="container text-center py-4" aria-labelledby="home-title">
        <h1 id="home-title" className="display-5 text-primary mb-3">
          Dulces momentos, hechos para compartir.
        </h1>
        <p className="lh-lg mb-0">
          Tortas y postres preparados para acompañar tus celebraciones.
        </p>
      </section>
      <section className="container mb-5 text-center" aria-labelledby="home-products-title">
        <h2 id="home-products-title" className="h4 text-uppercase mb-3">
          Los más recomendados
        </h2>
        <ProductGrid
          products={products.slice(0, 4)}
          className="row g-3 g-lg-4 text-start mb-4"
          ariaLabel="Productos recomendados"
        />
        <h2 className="h4 text-uppercase mb-3">Compra por categoría</h2>
        <HomeCategoryLinks categories={categories} />
        <Link to="/productos" className="btn btn-outline-primary">
          Explorar catálogo
        </Link>
      </section>
    </main>
  );
}
