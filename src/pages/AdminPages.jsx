import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import {
  createCategory,
  createProduct,
  createUser,
  deleteCategory,
  deleteProduct,
  deleteUser,
  getOrders,
  getRegions,
  getUsers,
  updateProduct,
  updateUser,
} from "../data/database.js";
import { effectivePrice, formatPrice } from "../utils/pricing.js";
import { isValidChileanRun } from "../utils/validators.js";

export function AdminDashboardPage() {
  const { products } = useStore();
  const users = getUsers();
  const customers = users.filter((user) => user.tipoUsuario === "Cliente").length;
  const orders = getOrders();
  const paidOrders = orders.filter((order) => order.estado === "Pagada");
  const lowStock = products.filter(
    (product) =>
      Number.isFinite(product.stock) &&
      Number.isFinite(product.stockCritico) &&
      product.stock <= product.stockCritico,
  ).length;
  const stats = [
    { label: "Compras", value: paidOrders.length, note: `${orders.length} \u00f3rdenes registradas`, icon: "\u{1F6D2}", tone: "blue" },
    { label: "Productos", value: products.length, note: `${lowStock} con stock cr\u00edtico`, icon: "\u25b1", tone: "green" },
    { label: "Usuarios", value: users.length, note: `${customers} clientes registrados`, icon: "\u265f", tone: "yellow" },
  ];
  const shortcuts = [
    { label: "Dashboard", path: "/admin", description: "Resumen general de las m\u00e9tricas y actividades.", icon: "\u25c9" },
    { label: "\u00d3rdenes", path: "/admin/ordenes", description: "Revisa y gestiona las \u00f3rdenes de compra.", icon: "\u{1F6D2}" },
    { label: "Productos", path: "/admin/productos", description: "Administra el inventario y el cat\u00e1logo.", icon: "\u25b1" },
    { label: "Categor\u00edas", path: "/admin/categorias", description: "Organiza los productos para facilitar la navegaci\u00f3n.", icon: "\u25c7" },
    { label: "Usuarios", path: "/admin/usuarios", description: "Gestiona las cuentas y sus roles.", icon: "\u265f" },
    { label: "Reportes", path: "/admin/reportes", description: "Consulta las m\u00e9tricas de venta y stock.", icon: "\u25a5" },
    { label: "Perfil", path: "/admin/perfil", description: "Administra la informaci\u00f3n de tu cuenta.", icon: "\u2659" },
    { label: "Tienda", path: "/", description: "Visita la tienda como la ven tus clientes.", icon: "\u2302" },
  ];

  return (
    <div className="admin-dashboard">
      <header className="mb-4">
        <h1 className="h2">Dashboard</h1>
        <p className="text-secondary mb-0">Resumen de las actividades diarias.</p>
      </header>
      <div className="row g-3 mb-4">
        {stats.map(({ label, value, note, icon, tone }) => (
          <div className="col-12 col-md-4" key={label}>
            <div className={`card admin-stat admin-stat--${tone} h-100`}>
              <div className="card-body d-flex align-items-center gap-3">
                <span className="admin-stat-icon" aria-hidden="true">{icon}</span>
                <div>
                  <h2 className="h6 mb-1">{label}</h2>
                  <p className="h2 fw-bold mb-1">{value.toLocaleString("es-CL")}</p>
                  <p className="small mb-0">{note}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row g-3">
        {shortcuts.map(({ label, path, description, icon }) => (
          <div className="col-12 col-sm-6 col-xl-3" key={path}>
            <Link className="card admin-shortcut h-100 text-decoration-none text-center" to={path}>
              <div className="card-body">
                <span className="admin-shortcut-icon" aria-hidden="true">{icon}</span>
                <h2 className="h6 mt-2">{label}</h2>
                <p className="text-secondary small mb-0">{description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminProductsPage() {
  const { products, replaceProducts } = useStore();
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const visibleProducts = products.filter((product) =>
    `${product.codigo} ${product.nombre} ${product.categoria}`
      .toLocaleLowerCase("es")
      .includes(query.trim().toLocaleLowerCase("es")),
  );

  function removeProduct(product) {
    if (!window.confirm(`¿Eliminar ${product.nombre}?`)) return;
    setError("");
    try {
      deleteProduct(product.codigo);
      replaceProducts(products.filter((entry) => entry.codigo !== product.codigo));
      setMessage(`Producto ${product.codigo} - ${product.nombre} eliminado.`);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <>
      <header className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
        <div>
          <h1 className="h2">Productos</h1>
          <p className="text-secondary mb-0">Listado e inventario de la tienda.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/productos/nuevo">Nuevo producto</Link>
      </header>
      <div className="row mb-3">
        <div className="col-12 col-md-6">
          <label className="visually-hidden" htmlFor="admin-product-search">Buscar producto</label>
          <input className="form-control" id="admin-product-search" placeholder="Buscar por nombre, código o categoría" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </div>
      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      {message && <p className="alert alert-success" role="status">{message}</p>}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {visibleProducts.map((product) => (
              <tr key={product.codigo}>
                <td>{product.codigo}</td>
                <td>{product.nombre}</td>
                <td>{product.categoria}</td>
                <td>
                  {product.descuento > 0 && <del className="text-secondary me-1">{formatPrice(product.precio)}</del>}
                  {formatPrice(effectivePrice(product))}
                </td>
                <td>
                  {product.stock <= product.stockCritico
                    ? <span className="text-danger">Crítico: {product.stock}</span>
                    : product.stock}
                </td>
                <td className="text-nowrap">
                  <Link className="btn btn-sm btn-outline-secondary me-1" to={`/producto/${encodeURIComponent(product.codigo)}`}>Ver</Link>
                  <Link className="btn btn-sm btn-primary me-1" to={`/admin/productos/${encodeURIComponent(product.codigo)}/editar`}>Editar</Link>
                  <button className="btn btn-sm btn-danger" type="button" onClick={() => removeProduct(product)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleProducts.length === 0 && <p className="alert alert-light border">No se encontraron productos.</p>}
    </>
  );
}

const emptyProduct = {
  codigo: "",
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  stockCritico: "",
  descuento: "0",
  categoria: "",
  imagen: "",
};

export function AdminProductFormPage() {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const editingCode = code ?? searchParams.get("codigo");
  const navigate = useNavigate();
  const { products, categories, replaceProducts } = useStore();
  const existing = products.find((product) => product.codigo === editingCode);
  const [form, setForm] = useState(() =>
    existing ? { ...existing } : { ...emptyProduct },
  );
  const [error, setError] = useState("");

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    setError("");
    const product = {
      ...form,
      codigo: (existing ? existing.codigo : form.codigo.trim().toUpperCase()),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(String(form.precio).replace(",", ".")),
      stock: Number(form.stock),
      stockCritico: form.stockCritico === "" ? null : Number(form.stockCritico),
      descuento: Number(form.descuento || 0),
      imagen: form.imagen.trim(),
    };
    if (!product.codigo || !product.nombre || !Number.isFinite(product.precio) || product.precio < 0 || !Number.isInteger(product.stock) || product.stock < 0 || !Number.isFinite(product.descuento) || product.descuento < 0 || product.descuento > 90 || !product.categoria) {
      setError("Revisa los campos obligatorios y los valores numéricos.");
      return;
    }

    try {
      const nextProducts = existing
        ? products.map((entry) => entry.codigo === existing.codigo ? product : entry)
        : [...products, product];
      if (existing) updateProduct(existing.codigo, product);
      else createProduct(product);
      replaceProducts(nextProducts);
      navigate("/admin/productos");
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  return (
    <section className="admin-form-panel">
      <h1 className="h2">{existing ? "Editar producto" : "Nuevo producto"}</h1>
      <p className="text-secondary">Los campos marcados con * son obligatorios.</p>
      <form className="row g-3" onSubmit={submit}>
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="product-code">Código*</label>
          <input className="form-control" id="product-code" name="codigo" value={form.codigo} onChange={update} required minLength="3" maxLength="20" readOnly={Boolean(existing)} />
        </div>
        <div className="col-12 col-md-8">
          <label className="form-label" htmlFor="product-name">Nombre*</label>
          <input className="form-control" id="product-name" name="nombre" value={form.nombre} onChange={update} required maxLength="100" />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="product-description">Descripción</label>
          <textarea className="form-control" id="product-description" name="descripcion" value={form.descripcion} onChange={update} rows="3" maxLength="500" />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="product-price">Precio*</label>
          <input className="form-control" id="product-price" name="precio" type="number" min="0" step="0.01" value={form.precio} onChange={update} required />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="product-stock">Stock*</label>
          <input className="form-control" id="product-stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={update} required />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="product-critical-stock">Stock crítico</label>
          <input className="form-control" id="product-critical-stock" name="stockCritico" type="number" min="0" step="1" value={form.stockCritico ?? ""} onChange={update} />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="product-discount">Descuento (%)</label>
          <input className="form-control" id="product-discount" name="descuento" type="number" min="0" max="90" step="1" value={form.descuento ?? 0} onChange={update} />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="product-category">Categoría*</label>
          <select className="form-select" id="product-category" name="categoria" value={form.categoria} onChange={update} required>
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="product-image">Ruta de imagen</label>
          <input className="form-control" id="product-image" name="imagen" value={form.imagen} onChange={update} placeholder="/img/products/imagen_inicio.jpg" />
        </div>
        {error && <p className="col-12 text-danger" role="alert">{error}</p>}
        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary" type="submit">Guardar producto</button>
          <Link className="btn btn-outline-secondary" to="/admin/productos">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}

export function AdminCategoriesPage() {
  const { categories, setCategories, products } = useStore();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function add(event) {
    event.preventDefault();
    setError("");
    try {
      const nextCategories = [...categories, createCategory(name)];
      setCategories(nextCategories);
      setName("");
      setMessage("Categoría creada.");
    } catch (categoryError) {
      setError(categoryError.message);
    }
  }

  function remove(category) {
    setError("");
    setMessage("");
    try {
      deleteCategory(category);
      const nextCategories = categories.filter((entry) => entry !== category);
      setCategories(nextCategories);
      setMessage("Categoría eliminada.");
    } catch (categoryError) {
      setError(categoryError.message);
    }
  }

  return (
    <>
      <h1 className="h2">Categorías</h1>
      <p className="text-secondary">Organiza productos en categorías.</p>
      <form className="row g-2 mb-4" onSubmit={add}>
        <div className="col-12 col-md-6">
          <label className="visually-hidden" htmlFor="new-category">Nombre de la categoría</label>
          <input className="form-control" id="new-category" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nueva categoría" required maxLength="80" />
        </div>
        <div className="col-auto"><button className="btn btn-primary" type="submit">Crear categoría</button></div>
      </form>
      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      {message && <p className="alert alert-success" role="status">{message}</p>}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Categoría</th><th>Productos</th><th>Acciones</th></tr></thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category}>
                <td>{category}</td>
                <td>{products.filter((product) => product.categoria === category).length}</td>
                <td><button className="btn btn-sm btn-outline-danger" type="button" onClick={() => remove(category)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AdminUsersPage() {
  const [users, setUsers] = useState(getUsers);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const visibleUsers = users.filter((user) =>
    `${user.run} ${user.nombre} ${user.apellidos} ${user.correo}`
      .toLocaleLowerCase("es")
      .includes(query.trim().toLocaleLowerCase("es")),
  );

  function remove(user) {
    if (!window.confirm(`¿Eliminar a ${user.nombre} ${user.apellidos}?`)) return;
    setError("");
    try {
      deleteUser(user.run);
      const nextUsers = users.filter((entry) => entry.run !== user.run);
      setUsers(nextUsers);
      setMessage(`Usuario ${user.nombre} ${user.apellidos} eliminado.`);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <>
      <header className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
        <div><h1 className="h2">Usuarios</h1><p className="text-secondary mb-0">Cuentas registradas en la tienda.</p></div>
        <Link className="btn btn-primary" to="/admin/usuarios/nuevo">Nuevo usuario</Link>
      </header>
      <div className="col-12 col-md-6 mb-3">
        <label className="visually-hidden" htmlFor="admin-user-search">Buscar usuario</label>
        <input className="form-control" id="admin-user-search" placeholder="Buscar por nombre, RUN o correo" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      {message && <p className="alert alert-success" role="status">{message}</p>}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Tipo</th><th>Acciones</th></tr></thead>
          <tbody>
            {visibleUsers.map((user) => (
              <tr key={user.run}>
                <td>{user.run}</td><td>{user.nombre} {user.apellidos}</td><td>{user.correo}</td><td>{user.tipoUsuario}</td>
                <td className="text-nowrap">
                  <button className="btn btn-sm btn-primary me-1" type="button" onClick={() => navigate(`/admin/usuarios/${encodeURIComponent(user.run)}/editar`)}>Editar</button>
                  <button className="btn btn-sm btn-danger" type="button" onClick={() => remove(user)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const blankUser = {
  run: "", nombre: "", apellidos: "", correo: "", password: "",
  fechaNacimiento: "", tipoUsuario: "Cliente", region: "", comuna: "", direccion: "",
};

export function AdminUserFormPage() {
  const { run } = useParams();
  const [searchParams] = useSearchParams();
  const editingRun = run ?? searchParams.get("run");
  const navigate = useNavigate();
  const regions = getRegions();
  const existing = getUsers().find((user) => user.run === editingRun);
  const [form, setForm] = useState(() => existing ? { ...existing } : { ...blankUser });
  const [error, setError] = useState("");
  const selectedRegion = regions.find((region) => region.nombre === form.region);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current, [name]: value, ...(name === "region" ? { comuna: "" } : {}),
    }));
  }

  function submit(event) {
    event.preventDefault();
    setError("");
    if (!existing && !isValidChileanRun(form.run.trim())) {
      setError("Ingresa un RUN válido sin puntos ni guion.");
      return;
    }
    try {
      const user = { ...form, run: existing ? existing.run : form.run.trim().toUpperCase() };
      if (existing) updateUser(existing.run, user);
      else createUser(user);
      navigate("/admin/usuarios");
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  return (
    <section className="admin-form-panel">
      <h1 className="h2">{existing ? "Editar usuario" : "Nuevo usuario"}</h1>
      <form className="row g-3" onSubmit={submit}>
        <div className="col-12 col-md-4"><label className="form-label" htmlFor="admin-run">RUN*</label><input className="form-control" id="admin-run" name="run" value={form.run} onChange={update} required minLength="7" maxLength="9" readOnly={Boolean(existing)} /></div>
        <div className="col-12 col-md-4"><label className="form-label" htmlFor="admin-name">Nombre*</label><input className="form-control" id="admin-name" name="nombre" value={form.nombre} onChange={update} required maxLength="50" /></div>
        <div className="col-12 col-md-4"><label className="form-label" htmlFor="admin-lastname">Apellidos*</label><input className="form-control" id="admin-lastname" name="apellidos" value={form.apellidos} onChange={update} required maxLength="100" /></div>
        <div className="col-12 col-md-6"><label className="form-label" htmlFor="admin-email">Correo*</label><input className="form-control" id="admin-email" name="correo" type="email" value={form.correo} onChange={update} required /></div>
        <div className="col-12 col-md-6"><label className="form-label" htmlFor="admin-password">Contraseña*</label><input className="form-control" id="admin-password" name="password" type="password" value={form.password} onChange={update} required minLength="4" maxLength="10" /></div>
        <div className="col-12 col-md-6"><label className="form-label" htmlFor="admin-user-type">Tipo de usuario*</label><select className="form-select" id="admin-user-type" name="tipoUsuario" value={form.tipoUsuario} onChange={update}><option>Administrador</option><option>Vendedor</option><option>Cliente</option></select></div>
        <div className="col-12 col-md-6"><label className="form-label" htmlFor="admin-birth-date">Fecha de nacimiento</label><input className="form-control" id="admin-birth-date" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={update} /></div>
        <div className="col-12 col-md-6"><label className="form-label" htmlFor="admin-region">Región*</label><select className="form-select" id="admin-region" name="region" value={form.region} onChange={update} required><option value="">Selecciona una región</option>{regions.map((region) => <option key={region.nombre}>{region.nombre}</option>)}</select></div>
        <div className="col-12 col-md-6"><label className="form-label" htmlFor="admin-commune">Comuna*</label><select className="form-select" id="admin-commune" name="comuna" value={form.comuna} onChange={update} disabled={!selectedRegion} required><option value="">Selecciona una comuna</option>{selectedRegion?.comunas.map((commune) => <option key={commune}>{commune}</option>)}</select></div>
        <div className="col-12"><label className="form-label" htmlFor="admin-address">Dirección*</label><input className="form-control" id="admin-address" name="direccion" value={form.direccion} onChange={update} required maxLength="300" /></div>
        {error && <p className="col-12 text-danger" role="alert">{error}</p>}
        <div className="col-12 d-flex gap-2"><button className="btn btn-primary" type="submit">Guardar usuario</button><Link className="btn btn-outline-secondary" to="/admin/usuarios">Cancelar</Link></div>
      </form>
    </section>
  );
}

export function AdminOrdersPage() {
  const orders = getOrders();

  return (
    <>
      <h1 className="h2">Órdenes</h1>
      <p className="text-secondary">Historial de compras registradas.</p>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Número</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th>Total</th><th>Detalle</th></tr></thead>
          <tbody>{orders.map((order) => <tr key={order.id}><td>{order.id}</td><td>{new Date(order.fecha).toLocaleDateString("es-CL")}</td><td>{order.cliente.nombre} {order.cliente.apellidos}</td><td>{order.estado}</td><td>{formatPrice(order.total)}</td><td><Link to={`/admin/ordenes/${encodeURIComponent(order.id)}`}>Ver orden</Link></td></tr>)}</tbody>
        </table>
      </div>
      {orders.length === 0 && <p className="alert alert-light border">Todavía no hay órdenes registradas.</p>}
    </>
  );
}

export function AdminOrderDetailPage() {
  const { orderId } = useParams();
  const order = getOrders().find((entry) => entry.id === orderId);
  if (!order) return <p className="alert alert-warning">No se encontró esta orden.</p>;

  return (
    <>
      <h1 className="h2">Orden {order.id}</h1>
      <p>{order.cliente.nombre} {order.cliente.apellidos} · {order.estado}</p>
      <div className="table-responsive"><table className="table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Subtotal</th></tr></thead><tbody>{order.items.map((item) => <tr key={item.codigo}><td>{item.nombre}</td><td>{item.cantidad}</td><td>{formatPrice(item.subtotal)}</td></tr>)}</tbody></table></div>
      <p className="h5 text-end">Total: {formatPrice(order.total)}</p>
      <Link to="/admin/ordenes">Volver a órdenes</Link>
    </>
  );
}

export function AdminReportsPage() {
  const orders = getOrders();
  const { products } = useStore();
  const completedOrders = orders.filter((order) => order.estado === "Pagada");
  const revenue = completedOrders.reduce((total, order) => total + order.total, 0);
  const unitsSold = completedOrders.reduce(
    (total, order) => total + order.items.reduce((sum, item) => sum + item.cantidad, 0),
    0,
  );
  const criticalProducts = useMemo(
    () => products.filter((product) => product.stock <= product.stockCritico),
    [products],
  );

  return (
    <>
      <h1 className="h2">Reportes</h1>
      <div className="row g-3 my-3">
        {[["Ventas pagadas", formatPrice(revenue)], ["Órdenes pagadas", completedOrders.length], ["Unidades vendidas", unitsSold]].map(([label, value]) => <div className="col-12 col-md-4" key={label}><div className="card"><div className="card-body"><h2 className="h6">{label}</h2><p className="h3 mb-0">{value}</p></div></div></div>)}
      </div>
      <h2 className="h4 mt-4">Productos con stock crítico</h2>
      {criticalProducts.length ? <ul className="list-group">{criticalProducts.map((product) => <li className="list-group-item d-flex justify-content-between" key={product.codigo}><span>{product.nombre}</span><strong>{product.stock} unidades</strong></li>)}</ul> : <p>No hay productos con stock crítico.</p>}
    </>
  );
}

export function AdminProfilePage() {
  let user = null;
  const session = sessionStorage.getItem("usuarioActual");
  if (session) user = JSON.parse(session);

  return (
    <>
      <h1 className="h2">Perfil</h1>
      {user ? <dl className="row"><dt className="col-sm-3">Nombre</dt><dd className="col-sm-9">{user.nombre} {user.apellidos}</dd><dt className="col-sm-3">Correo</dt><dd className="col-sm-9">{user.correo}</dd><dt className="col-sm-3">Rol</dt><dd className="col-sm-9">{user.tipoUsuario}</dd></dl> : <p>Sesión de demostración sin usuario conectado.</p>}
      <p className="text-secondary small">La administración de esta aplicación usa datos locales de demostración.</p>
    </>
  );
}
