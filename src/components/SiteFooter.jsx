import NewsletterSubscriptionForm from "./NewsletterSubscriptionForm.jsx";

export default function SiteFooter() {
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
        <NewsletterSubscriptionForm />
      </div>
    </footer>
  );
}
