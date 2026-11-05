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

export function validateRegistration(form, regions) {
  if (!isValidChileanRun(form.run.trim())) {
    return "Ingresa un RUN v\u00e1lido sin puntos ni guion.";
  }
  if (!form.nombre.trim() || form.nombre.trim().length > 50) {
    return "Ingresa un nombre de hasta 50 caracteres.";
  }
  if (!form.apellidos.trim() || form.apellidos.trim().length > 100) {
    return "Ingresa apellidos de hasta 100 caracteres.";
  }
  if (!isValidEmail(form.correo)) {
    return "Ingresa un correo v\u00e1lido de hasta 100 caracteres.";
  }
  if (!isValidPassword(form.password)) {
    return "La contrase\u00f1a debe tener entre 4 y 10 caracteres.";
  }

  const selectedRegion = regions.find((region) => region.nombre === form.region);
  if (!selectedRegion) {
    return "Selecciona una regi\u00f3n v\u00e1lida.";
  }
  if (!selectedRegion.comunas.includes(form.comuna)) {
    return "Selecciona una comuna v\u00e1lida para la regi\u00f3n indicada.";
  }
  if (!form.direccion.trim() || form.direccion.trim().length > 300) {
    return "Ingresa una direcci\u00f3n de hasta 300 caracteres.";
  }

  return "";
}

export function validateCheckoutDetails(address, regions) {
  if (!address.nombre.trim() || address.nombre.trim().length > 50) {
    return "Ingresa un nombre de hasta 50 caracteres.";
  }
  if (!address.apellidos.trim() || address.apellidos.trim().length > 100) {
    return "Ingresa apellidos de hasta 100 caracteres.";
  }
  if (!isValidEmail(address.correo)) {
    return "Ingresa un correo v\u00e1lido que incluya @.";
  }
  if (!address.calle.trim() || address.calle.trim().length > 200) {
    return "Ingresa una direcci\u00f3n de hasta 200 caracteres.";
  }
  if (address.departamento.length > 50) {
    return "El departamento debe tener hasta 50 caracteres.";
  }
  if (address.indicaciones.length > 500) {
    return "Las indicaciones deben tener hasta 500 caracteres.";
  }

  const selectedRegion = regions.find(
    (region) => region.nombre === address.region,
  );
  if (!selectedRegion) {
    return "Selecciona una regi\u00f3n v\u00e1lida.";
  }
  if (!selectedRegion.comunas.includes(address.comuna)) {
    return "Selecciona una comuna v\u00e1lida para la regi\u00f3n indicada.";
  }

  return "";
}
