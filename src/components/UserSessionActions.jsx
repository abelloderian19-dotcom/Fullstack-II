import { Link, useLocation, useNavigate } from "react-router-dom";

function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem("usuarioActual") ?? "null");
  } catch {
    return null;
  }
}

export default function UserSessionActions() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();

  function signOut() {
    sessionStorage.removeItem("usuarioActual");
    navigate(location.pathname === "/login" ? "/" : "/login");
  }

  if (currentUser) {
    return (
      <div className="d-flex flex-wrap align-items-center gap-2 ms-lg-auto">
        <span className="small text-nowrap">Hola, {currentUser.nombre}</span>
        <button className="btn btn-outline-secondary btn-sm" type="button" onClick={signOut}>
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex gap-2 ms-lg-auto">
      <Link className="btn btn-primary btn-sm" to="/login">Iniciar sesión</Link>
      <Link className="btn btn-primary btn-sm" to="/registro">Crear cuenta</Link>
    </div>
  );
}
