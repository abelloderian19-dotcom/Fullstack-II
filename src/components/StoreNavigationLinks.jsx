import { NavLink } from "react-router-dom";

const navigation = [
  ["Inicio", "/"],
  ["Productos", "/productos"],
  ["Categorías", "/categorias"],
  ["Ofertas", "/ofertas"],
  ["Nosotros", "/nosotros"],
  ["Blogs", "/blogs"],
  ["Contacto", "/contacto"],
];

export default function StoreNavigationLinks() {
  return (
    <ul className="nav flex-grow-1 justify-content-center">
      {navigation.map(([label, href]) => (
        <li className="nav-item" key={label}>
          <NavLink
            className={({ isActive }) => `nav-link link-primary px-2${isActive ? " active" : ""}`}
            to={href}
            end={href === "/"}
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
