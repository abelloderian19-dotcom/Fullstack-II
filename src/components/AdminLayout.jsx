import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const adminNavigation = [
  ["Dashboard", "/admin", "▦"],
  ["Órdenes", "/admin/ordenes", "□"],
  ["Productos", "/admin/productos", "▣"],
  ["Categorías", "/admin/categorias", "☷"],
  ["Usuarios", "/admin/usuarios", "♙"],
  ["Reportes", "/admin/reportes", "◷"],
  ["Perfil", "/admin/perfil", "◉"],
];

export default function AdminLayout() {
  const navigate = useNavigate();

  function signOut() {
    sessionStorage.removeItem("usuarioActual");
    navigate("/login");
  }

  return (
    <div className="container-fluid admin-layout">
      <div className="row min-vh-100">
        <aside className="col-12 col-md-3 col-lg-2 admin-sidebar p-0">
          <header className="admin-sidebar-brand">
            <Link to="/admin" aria-label={"Panel de administración"}>
              <img className="admin-brand-logo" src="/img/logo-tienda.svg" alt="" />
              <span>1000 Sabores</span>
            </Link>
          </header>
          <nav className="nav flex-column admin-sidebar-nav p-2" aria-label={"Navegación administrativa"}>
            {adminNavigation.map(([label, path, icon]) => (
              <NavLink
                end={path === "/admin"}
                className={({ isActive }) => "nav-link admin-nav-link" + (path === "/admin/perfil" ? " admin-nav-profile" : "") + (isActive ? " active" : "")}
                to={path}
                key={path}
              >
                <span className="admin-nav-icon" aria-hidden="true">{icon}</span>
                {label}
              </NavLink>
            ))}
            <div className="admin-sidebar-actions">
              <Link className="nav-link admin-sidebar-action admin-store-link" to="/">
                <span aria-hidden="true">{"⌂"}</span> Tienda
              </Link>
              <button className="nav-link admin-sidebar-action admin-signout text-start" type="button" onClick={signOut}>
                <span aria-hidden="true">{""}</span> {"Cerrar sesion"}
              </button>
            </div>
          </nav>
        </aside>
        <div className="col-12 col-md-9 col-lg-10 d-flex flex-column min-vh-100">
          <main className="admin-layout-main flex-grow-1 p-3 p-lg-4">
            <Outlet />
          </main>
          <footer className="text-center p-3">
            <p className="mb-0 text-secondary">{"Pasteleria 1000 Sabores"}</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
