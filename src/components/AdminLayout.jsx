import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const adminNavigation = [
  ["Dashboard", "/admin"],
  ["Órdenes", "/admin/ordenes"],
  ["Productos", "/admin/productos"],
  ["Categorías", "/admin/categorias"],
  ["Usuarios", "/admin/usuarios"],
  ["Reportes", "/admin/reportes"],
  ["Perfil", "/admin/perfil"],
];

export default function AdminLayout() {
  const navigate = useNavigate();

  function signOut() {
    sessionStorage.removeItem("usuarioActual");
    navigate("/login");
  }

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <aside className="col-12 col-md-3 col-lg-2 admin-sidebar p-0">
          <header className="text-center p-3 border-bottom">
            <Link to="/admin" aria-label="Panel de administración">
              <img src="/img/logo-tienda.svg" alt="" width="68" height="68" />
            </Link>
            <h1 className="h5 mt-2 mb-0">1000 Sabores</h1>
            <span className="small text-secondary">Administrador</span>
          </header>
          <nav className="nav flex-column p-2" aria-label="Navegación administrativa">
            {adminNavigation.map(([label, path]) => (
              <NavLink
                end={path === "/admin"}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                to={path}
                key={path}
              >
                {label}
              </NavLink>
            ))}
            <Link className="nav-link" to="/">Ver tienda</Link>
            <button className="nav-link text-start" type="button" onClick={signOut}>
              Cerrar sesión
            </button>
          </nav>
        </aside>
        <div className="col-12 col-md-9 col-lg-10 d-flex flex-column min-vh-100">
          <main className="flex-grow-1 p-3 p-lg-4">
            <Outlet />
          </main>
          <footer className="text-center p-3">
            <p className="mb-0 text-secondary">© 2026 Pastelería 1000 Sabores</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
