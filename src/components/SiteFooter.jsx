import { useState } from "react";

export default function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false);

  function subscribe(event) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <footer className="border-top bg-light mt-4 py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-start gap-4">
        <div>
          <div className="fw-semibold mb-3">Pastelería 1000 Sabores</div>
          <div className="d-flex gap-2" aria-label="Medios de pago">
            <span className="border rounded px-2 py-1 small">VISA</span>
            <span className="border rounded px-2 py-1 small">💵 EFECTIVO</span>
          </div>
        </div>
        <div className="footer-newsletter">
          <p className="fw-semibold mb-2">
            ¡Mantente en contacto! Únete a nuestro boletín
          </p>
          <form
            className="d-flex gap-2"
            onSubmit={subscribe}
          >
            <label className="visually-hidden" htmlFor="newsletter-email">
              Correo electrónico
            </label>
            <input
              className="form-control form-control-sm"
              type="email"
              id="newsletter-email"
              name="email"
              placeholder="Ingresa tu correo electrónico"
              autoComplete="email"
              required
            />
            <button className="btn btn-primary btn-sm flex-shrink-0" type="submit">
              Suscribirse
            </button>
          </form>
          {subscribed && (
            <p className="small text-success mt-2 mb-0" role="status">
              ¡Gracias por suscribirte!
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
