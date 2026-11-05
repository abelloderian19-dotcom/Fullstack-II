import SiteFooter from "../components/SiteFooter.jsx";
import SiteHeader from "../components/SiteHeader.jsx";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
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
            <a href="./productos.html" className="btn btn-primary">
              Ver productos
            </a>
          </div>
          <div className="col-12 col-md-7 p-3">
            <div className="ratio ratio-16x9 border border-dark">
              <img
                className="w-100 h-100 object-fit-cover"
                src="./img/products/imagen_inicio.jpg"
                alt="Pasteles y postres de Pastelería 1000 Sabores"
              />
            </div>
          </div>
        </section>
        <section className="mb-5 text-center" aria-labelledby="migration-title">
          <h2 id="migration-title" className="h4 text-uppercase mb-3">
            Los más recomendados
          </h2>
          <p className="texto-secundario">
            Explora nuestra selección de tortas y postres preparados cada día.
          </p>
          <a href="./productos.html" className="btn btn-outline-primary">
            Explorar catálogo
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
