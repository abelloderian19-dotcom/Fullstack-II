import { Link } from "react-router-dom";
import CartSummaryLink from "./CartSummaryLink.jsx";
import StoreNavigationLinks from "./StoreNavigationLinks.jsx";
import StoreSearchForm from "./StoreSearchForm.jsx";
import UserSessionActions from "./UserSessionActions.jsx";

export default function Navbar() {
  return (
    <header className="bg-secondary-subtle border-bottom border-dark">
      <div className="container">
        <nav
          className="d-flex flex-wrap align-items-center justify-content-between gap-3 py-3"
          aria-label="Navegación principal"
        >
          <Link
            className="navbar-brand d-flex align-items-center gap-2 fw-semibold text-dark text-decoration-none"
            to="/"
          >
            <img src="/img/logo-tienda.svg" alt="" width="36" height="36" />
            <span>Pastelería 1000 Sabores</span>
          </Link>
          <StoreSearchForm />
          <StoreNavigationLinks />
          <CartSummaryLink />
          <UserSessionActions />
        </nav>
      </div>
    </header>
  );
}
