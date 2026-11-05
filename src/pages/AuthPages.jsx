import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser, getRegions, getUsers } from "../data/database.js";
import { validateLogin, validateRegistration } from "../utils/validators.js";

function saveSession(user) {
  const { password: _password, ...sessionUser } = user;
  sessionStorage.setItem("usuarioActual", JSON.stringify(sessionUser));
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    const user = getUsers().find(
      (entry) =>
        entry.correo.toLowerCase() === email.trim().toLowerCase() &&
        entry.password === password,
    );
    if (!user) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    saveSession(user);
    navigate(user.tipoUsuario === "Administrador" ? "/admin" : "/");
  }

  return (
    <main className="container d-flex justify-content-center py-5">
      <section className="col-12 col-sm-9 col-md-6 col-lg-5">
        <img className="d-block mx-auto mb-3" src="/img/logo-tienda.svg" alt="" width="90" height="90" />
        <h1 className="h3 text-center mb-4">Iniciar sesión</h1>
        <form className="card bg-light p-3 p-md-4" onSubmit={submit}>
          <label className="form-label" htmlFor="login-email">Correo</label>
          <input className="form-control mb-3" id="login-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label className="form-label" htmlFor="login-password">Contraseña</label>
          <input className="form-control mb-3" id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="text-danger" role="alert">{error}</p>}
          <button className="btn btn-primary align-self-center" type="submit">Iniciar sesión</button>
          <p className="small text-secondary mt-3 mb-0">
            Cuentas de demostración: ana.perez@duoc.cl / admin123, maria.gonzalez@gmail.com / cliente1.
          </p>
          <Link className="text-center mt-3" to="/registro">Crear una cuenta</Link>
        </form>
      </section>
    </main>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const regions = getRegions();
  const [form, setForm] = useState({
    run: "",
    nombre: "",
    apellidos: "",
    correo: "",
    password: "",
    region: "",
    comuna: "",
    direccion: "",
  });
  const [error, setError] = useState("");
  const selectedRegion = regions.find((region) => region.nombre === form.region);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "region" ? { comuna: "" } : {}),
    }));
  }

  function submit(event) {
    event.preventDefault();
    setError("");
    const validationError = validateRegistration(form, regions);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const user = createUser({
        ...form,
        run: form.run.trim().toUpperCase(),
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        correo: form.correo.trim().toLowerCase(),
        direccion: form.direccion.trim(),
        tipoUsuario: "Cliente",
        fechaNacimiento: "",
      });
      saveSession(user);
      navigate("/");
    } catch (registrationError) {
      setError(registrationError.message);
    }
  }

  return (
    <main className="container py-4">
      <section className="mx-auto auth-panel">
        <h1 className="h2 mb-3">Crear cuenta</h1>
        <form className="card bg-light p-3 p-md-4 shadow-sm" onSubmit={submit} noValidate>
          <div className="row g-3">
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="register-run">RUN*</label>
            <input className="form-control" id="register-run" name="run" autoComplete="off" value={form.run} onChange={update} placeholder="12345678K" minLength="7" maxLength="9" required />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="register-name">Nombre*</label>
            <input className="form-control" id="register-name" name="nombre" autoComplete="given-name" value={form.nombre} onChange={update} required maxLength="50" />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="register-lastname">Apellidos*</label>
            <input className="form-control" id="register-lastname" name="apellidos" autoComplete="family-name" value={form.apellidos} onChange={update} required maxLength="100" />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="register-email">Correo*</label>
            <input className="form-control" id="register-email" name="correo" type="email" autoComplete="email" value={form.correo} onChange={update} required maxLength="100" />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="register-password">Contraseña*</label>
            <input className="form-control" id="register-password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={update} required minLength="4" maxLength="10" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="register-region">Región*</label>
            <select className="form-select" id="register-region" name="region" value={form.region} onChange={update} required>
              <option value="">Selecciona una región</option>
              {regions.map((region) => <option key={region.nombre}>{region.nombre}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="register-commune">Comuna*</label>
            <select className="form-select" id="register-commune" name="comuna" value={form.comuna} onChange={update} disabled={!selectedRegion} required>
              <option value="">Selecciona una comuna</option>
              {selectedRegion?.comunas.map((commune) => <option key={commune}>{commune}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="register-address">Dirección*</label>
            <input className="form-control" id="register-address" name="direccion" autoComplete="street-address" value={form.direccion} onChange={update} required maxLength="300" />
          </div>
          {error && <p className="col-12 text-danger mb-0" role="alert">{error}</p>}
          <div className="col-12 d-flex flex-wrap gap-2">
            <button className="btn btn-primary" type="submit">Crear cuenta</button>
            <Link className="btn btn-outline-secondary" to="/login">Ya tengo una cuenta</Link>
          </div>
          </div>
        </form>
      </section>
    </main>
  );
}
