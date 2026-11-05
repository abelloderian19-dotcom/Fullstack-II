import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

const navigation = [
  ["Inicio", "/"],
  ["Productos", "/productos"],
  ["Categorías", "/categorias"],
  ["Ofertas", "/ofertas"],
  ["Nosotros", "/nosotros"],
  ["Blogs", "/blogs"],
  ["Contacto", "/contacto"],
];

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useStore();
  const previousCartCount = useRef(cartCount);
  const [cartUpdated, setCartUpdated] = useState(false);
  let currentUser = null;
  try {
    currentUser = JSON.parse(sessionStorage.getItem("usuarioActual") ?? "null");
  } catch {
    currentUser = null;
  }

  useEffect(() => {
    if (previousCartCount.current === cartCount) return undefined;

    previousCartCount.current = cartCount;
    setCartUpdated(true);
    const timeout = window.setTimeout(() => setCartUpdated(false), 550);

    return () => window.clearTimeout(timeout);
  }, [cartCount]);

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/productos?q=${encodeURIComponent(search.trim())}`);
  }

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
          <form
            className="d-flex gap-2 flex-grow-1 flex-lg-grow-0"
            onSubmit={submitSearch}
            role="search"
          >
            <label className="visually-hidden" htmlFor="store-search">
              Buscar productos
            </label>
            <input
              className="form-control form-control-sm"
              id="store-search"
              type="search"
              placeholder="Buscar"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button className="btn btn-outline-primary btn-sm" type="submit">
              Buscar
            </button>
          </form>
          <ul className="nav flex-grow-1 justify-content-center">
            {navigation.map(([label, href]) => (
              <li className="nav-item" key={label}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link link-primary px-2${isActive ? " active" : ""}`
                  }
                  to={href}
                  end={href === "/"}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            className={
              "navbar-cart d-flex align-items-center gap-2 text-decoration-none text-nowrap" +
              (cartUpdated ? " is-updating" : "")
            }
            to="/carrito"
            aria-label={"Carrito de compras, " + cartCount + " " + (cartCount === 1 ? "producto" : "productos")}
          >
            <span className="navbar-cart-icon" aria-hidden="true">{"\u{1F6D2}"}</span>
            <span className="navbar-cart-label">Carrito</span>
            <span className="navbar-cart-count" aria-live="polite">
              {cartCount}
            </span>
          </Link>
          {currentUser ? (
            <div className="d-flex flex-wrap align-items-center gap-2 ms-lg-auto">
              <span className="small text-nowrap">Hola, {currentUser.nombre}</span>
              <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => {
                sessionStorage.removeItem("usuarioActual");
                navigate(location.pathname === "/login" ? "/" : "/login");
              }}>Cerrar sesión</button>
            </div>
          ) : (
          <div className="d-flex gap-2 ms-lg-auto">
            <Link className="btn btn-primary btn-sm" to="/login">
              Iniciar sesión
            </Link>
            <Link className="btn btn-primary btn-sm" to="/registro">
              Crear cuenta
            </Link>
          </div>
          )}
        </nav>
      </div>
    </header>
  );
}
