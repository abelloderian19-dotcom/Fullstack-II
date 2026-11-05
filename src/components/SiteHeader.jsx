const navigation = [
  ["Inicio", "./index.html"],
  ["Productos", "./productos.html"],
  ["Nosotros", "./nosotros.html"],
  ["Blogs", "./blogs.html"],
  ["Contacto", "./contacto.html"],
];

export default function SiteHeader() {
  return (
    <header className="bg-secondary-subtle border-bottom border-dark">
      <div className="container">
        <nav
          className="d-flex flex-wrap align-items-center gap-3 py-3"
          aria-label="Navegación principal"
        >
          <a
            className="navbar-brand d-flex align-items-center gap-2 fw-semibold text-dark text-decoration-none"
            href="./index.html"
          >
            <img src="./img/logo-tienda.svg" alt="" width="36" height="36" />
            <span>Pastelería 1000 Sabores</span>
          </a>
          <ul className="nav flex-grow-1 justify-content-center">
            {navigation.map(([label, href]) => (
              <li className="nav-item" key={label}>
                <a className="nav-link link-primary px-2" href={href}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            className="d-flex align-items-center gap-2 text-dark text-decoration-none"
            href="./carrito.html"
            aria-label="Carrito de compras"
          >
            <span aria-hidden="true">🛒</span>
            <span>Carrito</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
