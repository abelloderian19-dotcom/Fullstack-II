import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const articles = [
  {
    id: "receta-familiar",
    title: "Caso curioso #1",
    image: "/img/products/imagen_inicio.jpg",
    summary:
      "Descubre cómo una receta familiar y algunos ingredientes inesperados dieron vida a uno de nuestros pasteles favoritos.",
    body:
      "Todo comenzó con una receta compartida en familia y el deseo de preparar algo especial. Después de varias pruebas encontramos el equilibrio perfecto entre una masa suave, fruta de temporada y una crema preparada en nuestra cocina. Hoy es uno de los sabores que más nos recuerda por qué nos encanta compartir.",
  },
  {
    id: "conservar-frescura",
    title: "Caso curioso #2",
    image: "/img/products/torta-frutas.jpg",
    summary:
      "Te contamos algunos consejos sencillos para conservar la frescura y disfrutar cada porción como recién preparada.",
    body:
      "Para disfrutar al máximo nuestros pasteles, mantenlos refrigerados y dentro de un recipiente cerrado. Antes de servir, déjalos unos minutos a temperatura ambiente para que recuperen su textura y aroma. Así cada porción conserva el sabor y la dedicación con que fue preparada.",
  },
];

export function AboutPage() {
  return (
    <main className="container py-5">
      <section className="row align-items-center g-4">
        <div className="col-12 col-md-6">
          <p className="text-uppercase small text-secondary">Nuestra historia</p>
          <h1 className="h2">Hecho con dedicación, para compartir</h1>
          <p>
            En Pastelería 1000 Sabores preparamos tortas y postres con
            ingredientes seleccionados, cuidando cada detalle para acompañar tus
            momentos importantes.
          </p>
          <Link className="btn btn-primary" to="/productos">
            Conoce nuestros productos
          </Link>
        </div>
        <div className="col-12 col-md-6">
          <img
            className="img-fluid rounded"
            src="/img/products/imagen_inicio.jpg"
            alt="Preparaciones de Pastelería 1000 Sabores"
          />
        </div>
      </section>
    </main>
  );
}

export function BlogPage() {
  return (
    <main className="container py-4">
      <h1 className="h2 text-center mb-4">Noticias importantes</h1>
      <section className="d-grid gap-4" aria-label="Noticias y artículos">
        {articles.map((article) => (
          <article className="row align-items-stretch g-0 bg-secondary-subtle" key={article.id}>
            <div className="col-12 col-md-5 d-flex flex-column p-4 p-lg-5">
              <h2 className="h3 text-uppercase mb-3">{article.title}</h2>
              <p>{article.summary}</p>
              <Link className="btn btn-light border mt-auto align-self-start" to={`/blogs/${article.id}`}>
                Ver artículo
              </Link>
            </div>
            <div className="col-12 col-md-7 p-3">
              <div className="ratio ratio-16x9 border">
                <img className="object-fit-cover" src={article.image} alt="" />
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export function BlogDetailPage() {
  const { articleId } = useParams();
  const { pathname } = useLocation();
  const resolvedId =
    articleId ??
    (pathname.endsWith("detalle-blog1.html")
      ? "receta-familiar"
      : pathname.endsWith("detalle-blog2.html")
        ? "conservar-frescura"
        : undefined);
  const article = articles.find((entry) => entry.id === resolvedId);

  if (!article) {
    return (
      <main className="container py-5">
        <p className="alert alert-warning">No encontramos este artículo.</p>
        <Link to="/blogs">Volver a noticias</Link>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <Link to="/blogs">← Volver a noticias</Link>
      <article className="mx-auto mt-3 article-content">
        <h1 className="h2">{article.title}</h1>
        <img className="img-fluid rounded mb-4" src={article.image} alt="" />
        <p className="lh-lg">{article.body}</p>
      </article>
    </main>
  );
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function submit(event) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <main className="container d-flex justify-content-center py-4">
      <section className="col-12 col-sm-10 col-md-7 col-lg-6" aria-labelledby="contact-title">
        <h1 className="h2 text-center mb-4" id="contact-title">Contáctanos</h1>
        <form className="card bg-light border p-3 p-md-4" onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="contact-name">Nombre completo</label>
            <input className="form-control" id="contact-name" name="nombre" type="text" autoComplete="name" minLength="3" maxLength="80" required />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="contact-email">Correo</label>
            <input className="form-control" id="contact-email" name="correo" type="email" autoComplete="email" maxLength="120" required />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="contact-message">Mensaje</label>
            <textarea className="form-control" id="contact-message" name="mensaje" rows="4" minLength="10" maxLength="1000" required />
          </div>
          {submitted && <p className="text-success" role="status">Tu mensaje fue registrado. ¡Gracias!</p>}
          <button className="btn btn-primary align-self-start" type="submit">Enviar mensaje</button>
        </form>
      </section>
    </main>
  );
}
