import { useState } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid.jsx";
import { useStore } from "../context/StoreContext.jsx";

const slides = [
  {
    image: "/img/products/imagen_inicio.jpg",
    title: "Nuevos lanzamientos",
    description: "Descubre las especialidades de Pasteler\u00eda 1000 Sabores.",
  },
  {
    image: "/img/products/torta-frutas.jpg",
    title: "Pasteles para compartir",
    description: "Celebra tus momentos especiales con algo delicioso.",
  },
  {
    image: "/img/products/cheesecake.jpg",
    title: "Cheesecakes irresistibles",
    description: "Encuentra tu pr\u00f3ximo postre favorito en nuestra tienda.",
  },
];

export default function HomePage() {
  const { products, categories } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);

  function changeSlide(direction) {
    setActiveSlide((current) => (current + slides.length + direction) % slides.length);
  }

  return (
    <main className="home-page py-3">
      <section
        className="home-carousel"
        role="region"
        aria-label={"Carrusel de la pasteler\u00eda"}
        aria-roledescription="carrusel"
      >
        {slides.map((slide, index) => (
          <div
            className={"home-carousel-slide" + (activeSlide === index ? " is-active" : "")}
            key={slide.image}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={"Diapositiva " + (index + 1) + " de " + slides.length}
            aria-hidden={activeSlide !== index}
          >
            <img src={slide.image} alt="" />
            <div className="home-carousel-shade" />
            <div className="home-carousel-caption">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              <Link className="btn btn-light btn-sm" to="/productos">
                Ver productos
              </Link>
            </div>
          </div>
        ))}

        <button
          className="home-carousel-control home-carousel-control--previous"
          type="button"
          aria-label="Imagen anterior"
          onClick={() => changeSlide(-1)}
        >
          <span aria-hidden="true">{"\u2039"}</span>
        </button>
        <button
          className="home-carousel-control home-carousel-control--next"
          type="button"
          aria-label="Siguiente imagen"
          onClick={() => changeSlide(1)}
        >
          <span aria-hidden="true">{"\u203a"}</span>
        </button>

        <div className="home-carousel-indicators" aria-label="Seleccionar diapositiva">
          {slides.map((slide, index) => (
            <button
              className={"home-carousel-indicator" + (activeSlide === index ? " is-active" : "")}
              key={slide.image}
              type="button"
              aria-label={"Ir a la diapositiva " + (index + 1)}
              aria-current={activeSlide === index ? "true" : undefined}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </section>

      <section className="container text-center py-4" aria-labelledby="home-title">
        <h1 id="home-title" className="display-5 text-primary mb-3">
          Dulces momentos, hechos para compartir.
        </h1>
        <p className="lh-lg mb-0">
          {"Tortas y postres preparados para acompa\u00f1ar tus celebraciones."}
        </p>
      </section>

      <section className="container mb-5 text-center" aria-labelledby="migration-title">
        <h2 id="migration-title" className="h4 text-uppercase mb-3">
          {"Los m\u00e1s recomendados"}
        </h2>
        <ProductGrid
          products={products.slice(0, 4)}
          className="row g-3 g-lg-4 text-start mb-4"
          ariaLabel="Productos recomendados"
        />
        <h2 className="h4 text-uppercase mb-3">{"Compra por categor\u00eda"}</h2>
        <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
          {categories.slice(0, 4).map((category) => (
            <div className="col" key={category}>
              <Link
                className="btn btn-light border w-100 h-100 py-3"
                to={"/categorias?nombre=" + encodeURIComponent(category)}
              >
                {category}
              </Link>
            </div>
          ))}
        </div>
        <Link to="/productos" className="btn btn-outline-primary">
          {"Explorar cat\u00e1logo"}
        </Link>
      </section>
    </main>
  );
}
