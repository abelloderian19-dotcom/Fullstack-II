import { useState } from "react";

export default function NewsletterSubscriptionForm() {
  const [subscribed, setSubscribed] = useState(false);

  function subscribe(event) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <div className="footer-newsletter">
      <p className="fw-semibold mb-2">¡Mantente en contacto! Únete a nuestro boletín</p>
      <form className="d-flex gap-2" onSubmit={subscribe}>
        <label className="visually-hidden" htmlFor="newsletter-email">Correo electrónico</label>
        <input
          className="form-control form-control-sm"
          type="email"
          id="newsletter-email"
          name="email"
          placeholder="Ingresa tu correo electrónico"
          autoComplete="email"
          required
        />
        <button className="btn btn-primary btn-sm flex-shrink-0" type="submit">Suscribirse</button>
      </form>
      {subscribed && (
        <p className="small text-success mt-2 mb-0" role="status">¡Gracias por suscribirte!</p>
      )}
    </div>
  );
}
