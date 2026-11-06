import { useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    image: "/img/products/imagen_inicio.jpg",
    title: "Nuevos lanzamientos",
    description: "Descubre las especialidades de Pastelería 1000 Sabores.",
  },
  {
    image: "/img/products/torta-frutas.jpg",
    title: "Pasteles para compartir",
    description: "Celebra tus momentos especiales con algo delicioso.",
  },
  {
    image: "/img/products/cheesecake.jpg",
    title: "Cheesecakes irresistibles",
    description: "Encuentra tu próximo postre favorito en nuestra tienda.",
  },
];

export default function HomeCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  function changeSlide(direction) {
    setActiveSlide((current) => (current + slides.length + direction) % slides.length);
  }

  return (
    <section
      className="home-carousel"
      role="region"
      aria-label="Carrusel de la pastelería"
      aria-roledescription="carrusel"
    >
      {slides.map((slide, index) => (
        <div
          className={`home-carousel-slide${activeSlide === index ? " is-active" : ""}`}
          key={slide.image}
          role="group"
          aria-roledescription="diapositiva"
          aria-label={`Diapositiva ${index + 1} de ${slides.length}`}
          aria-hidden={activeSlide !== index}
        >
          <img src={slide.image} alt="" />
          <div className="home-carousel-shade" />
          <div className="home-carousel-caption">
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
            <Link className="btn btn-light btn-sm" to="/productos">Ver productos</Link>
          </div>
        </div>
      ))}
      <button
        className="home-carousel-control home-carousel-control--previous"
        type="button"
        aria-label="Imagen anterior"
        onClick={() => changeSlide(-1)}
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        className="home-carousel-control home-carousel-control--next"
        type="button"
        aria-label="Siguiente imagen"
        onClick={() => changeSlide(1)}
      >
        <span aria-hidden="true">›</span>
      </button>
      <div className="home-carousel-indicators" aria-label="Seleccionar diapositiva">
        {slides.map((slide, index) => (
          <button
            className={`home-carousel-indicator${activeSlide === index ? " is-active" : ""}`}
            key={slide.image}
            type="button"
            aria-label={`Ir a la diapositiva ${index + 1}`}
            aria-current={activeSlide === index ? "true" : undefined}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}
