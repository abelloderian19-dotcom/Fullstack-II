export function isValidChileanRun(run) {
  if (typeof run !== "string" || !/^\d{6,8}[0-9k]$/i.test(run)) {
    return false;
  }

  const body = run.slice(0, -1);
  const digit = run.slice(-1).toUpperCase();
  let sum = 0;
  let factor = 2;

  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }

  const remainder = 11 - (sum % 11);
  const expected = remainder === 11 ? "0" : remainder === 10 ? "K" : String(remainder);
  return digit === expected;
}

export function isValidEmail(email) {
  return (
    typeof email === "string" &&
    email.trim().length <= 100 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  );
}

export function isValidPassword(password) {
  return typeof password === "string" && password.length >= 4 && password.length <= 10;
}

export function validateLogin(email, password) {
  if (typeof email !== "string" || !email.trim()) {
    return "Ingresa tu correo electr\u00f3nico.";
  }
  if (!isValidEmail(email)) {
    return "Ingresa un correo v\u00e1lido.";
  }
  if (typeof password !== "string" || !password) {
    return "Ingresa tu contrase\u00f1a.";
  }
  return "";
}

export function validateLoginField(field, value) {
  if (field === "email") {
    if (typeof value !== "string" || !value.trim()) return "Ingresa tu correo electrónico.";
    if (!isValidEmail(value)) return "Ingresa un correo válido.";
  }
  if (field === "password" && (typeof value !== "string" || !value)) {
    return "Ingresa tu contraseña.";
  }
  return "";
}

export function validateRegistrationField(field, form, regions) {
  switch (field) {
    case "run":
      return isValidChileanRun(form.run.trim()) ? "" : "Ingresa un RUN válido sin puntos ni guion.";
    case "nombre":
      return form.nombre.trim() && form.nombre.trim().length <= 50 ? "" : "Ingresa un nombre de hasta 50 caracteres.";
    case "apellidos":
      return form.apellidos.trim() && form.apellidos.trim().length <= 100 ? "" : "Ingresa apellidos de hasta 100 caracteres.";
    case "correo":
      return isValidEmail(form.correo) ? "" : "Ingresa un correo válido de hasta 100 caracteres.";
    case "password":
      return isValidPassword(form.password) ? "" : "La contraseña debe tener entre 4 y 10 caracteres.";
    case "region":
      return regions.some((region) => region.nombre === form.region) ? "" : "Selecciona una región válida.";
    case "comuna": {
      const selectedRegion = regions.find((region) => region.nombre === form.region);
      return selectedRegion?.comunas.includes(form.comuna) ? "" : "Selecciona una comuna válida para la región indicada.";
    }
    case "direccion":
      return form.direccion.trim() && form.direccion.trim().length <= 300 ? "" : "Ingresa una dirección de hasta 300 caracteres.";
    default:
      return "";
  }
}

export function validateRegistration(form, regions) {
  for (const field of ["run", "nombre", "apellidos", "correo", "password", "region", "comuna", "direccion"]) {
    const error = validateRegistrationField(field, form, regions);
    if (error) return error;
  }
  return "";
}

export function validateCheckoutField(field, address, regions) {
  switch (field) {
    case "nombre":
      return address.nombre.trim() && address.nombre.trim().length <= 50 ? "" : "Ingresa un nombre de hasta 50 caracteres.";
    case "apellidos":
      return address.apellidos.trim() && address.apellidos.trim().length <= 100 ? "" : "Ingresa apellidos de hasta 100 caracteres.";
    case "correo":
      return isValidEmail(address.correo) ? "" : "Ingresa un correo válido que incluya @.";
    case "calle":
      return address.calle.trim() && address.calle.trim().length <= 200 ? "" : "Ingresa una dirección de hasta 200 caracteres.";
    case "departamento":
      return address.departamento.length <= 50 ? "" : "El departamento debe tener hasta 50 caracteres.";
    case "indicaciones":
      return address.indicaciones.length <= 500 ? "" : "Las indicaciones deben tener hasta 500 caracteres.";
    case "region":
      return regions.some((region) => region.nombre === address.region) ? "" : "Selecciona una región válida.";
    case "comuna": {
      const selectedRegion = regions.find((region) => region.nombre === address.region);
      return selectedRegion?.comunas.includes(address.comuna) ? "" : "Selecciona una comuna válida para la región indicada.";
    }
    default:
      return "";
  }
}

export function validateCheckoutDetails(address, regions) {
  for (const field of ["nombre", "apellidos", "correo", "calle", "departamento", "indicaciones", "region", "comuna"]) {
    const error = validateCheckoutField(field, address, regions);
    if (error) return error;
  }
  return "";
}
