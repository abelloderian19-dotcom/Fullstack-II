import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser, getRegions, getUsers } from "../data/database.js";
import {
  validateLogin,
  validateLoginField,
  validateRegistration,
  validateRegistrationField,
} from "../utils/validators.js";

function saveSession(user) {
  const { password: _password, ...sessionUser } = user;
  sessionStorage.setItem("usuarioActual", JSON.stringify(sessionUser));
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function updateLoginField(field, value) {
    if (field === "email") setEmail(value);
    else setPassword(value);
    setFieldErrors((current) => Object.prototype.hasOwnProperty.call(current, field) ? {
      ...current,
      [field]: validateLoginField(field, value),
    } : current);
  }

  function blurLoginField(field, value) {
    setFieldErrors((current) => ({ ...current, [field]: validateLoginField(field, value) }));
  }

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
        <form className="card bg-light p-3 p-md-4" onSubmit={submit} noValidate>
          <label className="form-label" htmlFor="login-email">Correo</label>
          <input className={`form-control${fieldErrors.email ? " is-invalid" : ""}${fieldErrors.email ? "" : " mb-3"}`} id="login-email" type="email" autoComplete="username" value={email} onChange={(event) => updateLoginField("email", event.target.value)} onBlur={(event) => blurLoginField("email", event.target.value)} required aria-invalid={Boolean(fieldErrors.email)} />
          {fieldErrors.email && <div className="invalid-feedback mb-3" role="alert">{fieldErrors.email}</div>}
          <label className="form-label" htmlFor="login-password">Contraseña</label>
          <input className={`form-control${fieldErrors.password ? " is-invalid" : ""}${fieldErrors.password ? "" : " mb-3"}`} id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => updateLoginField("password", event.target.value)} onBlur={(event) => blurLoginField("password", event.target.value)} required aria-invalid={Boolean(fieldErrors.password)} />
          {fieldErrors.password && <div className="invalid-feedback mb-3" role="alert">{fieldErrors.password}</div>}
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
  const [runBody, setRunBody] = useState("");
  const [runVerifier, setRunVerifier] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const selectedRegion = regions.find((region) => region.nombre === form.region);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "region" ? { comuna: "" } : {}),
    }));
    setFieldErrors((current) => {
      const next = { ...current };
      if (name === "region") {
        delete next.comuna;
        if (current.region) next.region = validateRegistrationField(name, { ...form, region: value }, regions);
      } else if (Object.prototype.hasOwnProperty.call(current, name)) {
        next[name] = validateRegistrationField(name, { ...form, [name]: value }, regions);
      }
      return next;
    });
  }

  function updateRunBody(event) {
    const value = event.target.value;
    setRunBody(value);
    setForm((current) => ({ ...current, run: `${value}${runVerifier}` }));
    if (Object.prototype.hasOwnProperty.call(fieldErrors, "run")) {
      setFieldErrors((current) => ({
        ...current,
        run: validateRegistrationField("run", { ...form, run: `${value}${runVerifier}` }, regions),
      }));
    }
  }

  function updateRunVerifier(event) {
    const value = event.target.value.toUpperCase();
    setRunVerifier(value);
    setForm((current) => ({ ...current, run: `${runBody}${value}` }));
    if (Object.prototype.hasOwnProperty.call(fieldErrors, "run")) {
      setFieldErrors((current) => ({
        ...current,
        run: validateRegistrationField("run", { ...form, run: `${runBody}${value}` }, regions),
      }));
    }
  }

  function blurRun() {
    setFieldErrors((current) => ({
      ...current,
      run: validateRegistrationField("run", { ...form, run: `${runBody}${runVerifier}` }, regions),
    }));
  }

  function blurField(event) {
    const { name, value } = event.target;
    setFieldErrors((current) => ({
      ...current,
      [name]: validateRegistrationField(name, { ...form, [name]: value }, regions),
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
            <div className="input-group">
              <input className={`form-control${fieldErrors.run ? " is-invalid" : ""}`} id="register-run" autoComplete="off" value={runBody} onChange={updateRunBody} onBlur={blurRun} placeholder="12345678" maxLength="8" aria-label="RUN sin dígito verificador" required aria-invalid={Boolean(fieldErrors.run)} />
              <span className="input-group-text" aria-hidden="true">-</span>
              <input className={`form-control flex-grow-0 text-center${fieldErrors.run ? " is-invalid" : ""}`} value={runVerifier} onChange={updateRunVerifier} onBlur={blurRun} placeholder="K" maxLength="1" style={{ width: "4rem" }} aria-label="Dígito verificador del RUN" required aria-invalid={Boolean(fieldErrors.run)} />
            </div>
            {fieldErrors.run && <div className="invalid-feedback d-block" role="alert">{fieldErrors.run}</div>}
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="register-name">Nombre*</label>
            <input className={`form-control${fieldErrors.nombre ? " is-invalid" : ""}`} id="register-name" name="nombre" autoComplete="given-name" value={form.nombre} onChange={update} onBlur={blurField} required maxLength="50" aria-invalid={Boolean(fieldErrors.nombre)} />
            {fieldErrors.nombre && <div className="invalid-feedback" role="alert">{fieldErrors.nombre}</div>}
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="register-lastname">Apellidos*</label>
            <input className={`form-control${fieldErrors.apellidos ? " is-invalid" : ""}`} id="register-lastname" name="apellidos" autoComplete="family-name" value={form.apellidos} onChange={update} onBlur={blurField} required maxLength="100" aria-invalid={Boolean(fieldErrors.apellidos)} />
            {fieldErrors.apellidos && <div className="invalid-feedback" role="alert">{fieldErrors.apellidos}</div>}
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="register-email">Correo*</label>
            <input className={`form-control${fieldErrors.correo ? " is-invalid" : ""}`} id="register-email" name="correo" type="email" autoComplete="email" value={form.correo} onChange={update} onBlur={blurField} required maxLength="100" aria-invalid={Boolean(fieldErrors.correo)} />
            {fieldErrors.correo && <div className="invalid-feedback" role="alert">{fieldErrors.correo}</div>}
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="register-password">Contraseña*</label>
            <input className={`form-control${fieldErrors.password ? " is-invalid" : ""}`} id="register-password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={update} onBlur={blurField} required minLength="4" maxLength="10" aria-invalid={Boolean(fieldErrors.password)} />
            {fieldErrors.password && <div className="invalid-feedback" role="alert">{fieldErrors.password}</div>}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="register-region">Región*</label>
            <select className={`form-select${fieldErrors.region ? " is-invalid" : ""}`} id="register-region" name="region" value={form.region} onChange={update} onBlur={blurField} required aria-invalid={Boolean(fieldErrors.region)}>
              <option value="">Selecciona una región</option>
              {regions.map((region) => <option key={region.nombre}>{region.nombre}</option>)}
            </select>
            {fieldErrors.region && <div className="invalid-feedback" role="alert">{fieldErrors.region}</div>}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="register-commune">Comuna*</label>
            <select className={`form-select${fieldErrors.comuna ? " is-invalid" : ""}`} id="register-commune" name="comuna" value={form.comuna} onChange={update} onBlur={blurField} disabled={!selectedRegion} required aria-invalid={Boolean(fieldErrors.comuna)}>
              <option value="">Selecciona una comuna</option>
              {selectedRegion?.comunas.map((commune) => <option key={commune}>{commune}</option>)}
            </select>
            {fieldErrors.comuna && <div className="invalid-feedback" role="alert">{fieldErrors.comuna}</div>}
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="register-address">Dirección*</label>
            <input className={`form-control${fieldErrors.direccion ? " is-invalid" : ""}`} id="register-address" name="direccion" autoComplete="street-address" value={form.direccion} onChange={update} onBlur={blurField} required maxLength="300" aria-invalid={Boolean(fieldErrors.direccion)} />
            {fieldErrors.direccion && <div className="invalid-feedback" role="alert">{fieldErrors.direccion}</div>}
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
