import {
  isValidChileanRun,
  isValidEmail,
  isValidPassword,
  validateLogin,
  validateRegistration,
} from "./validators.js";

describe("validators", () => {
  const regions = [{ nombre: "Region de prueba", comunas: ["Comuna"] }];
  const validRegistration = {
    run: "123456785",
    nombre: "Ana",
    apellidos: "Perez Soto",
    correo: "ana@example.com",
    password: "clave123",
    region: "Region de prueba",
    comuna: "Comuna",
    direccion: "Calle 123",
  };

  it("validates Chilean RUNs, email addresses, and password length", () => {
    expect(isValidChileanRun("123456785")).toBe(true);
    expect(isValidChileanRun("123456784")).toBe(false);
    expect(isValidEmail("ana@example.com")).toBe(true);
    expect(isValidEmail("ana.example.com")).toBe(false);
    expect(isValidPassword("clave123")).toBe(true);
    expect(isValidPassword("abc")).toBe(false);
    expect(isValidPassword("demasiadolarga")).toBe(false);
  });

  it("validates login fields before checking credentials", () => {
    expect(validateLogin("", "clave123")).not.toBe("");
    expect(validateLogin("correo-invalido", "clave123")).not.toBe("");
    expect(validateLogin("ana@example.com", "")).not.toBe("");
    expect(validateLogin("ana@example.com", "clave123")).toBe("");
  });

  it("accepts a complete registration with a valid region and commune", () => {
    expect(validateRegistration(validRegistration, regions)).toBe("");
  });

  it("rejects registrations with an invalid RUN or account fields", () => {
    expect(
      validateRegistration({ ...validRegistration, run: "123456784" }, regions),
    ).not.toBe("");
    expect(
      validateRegistration({ ...validRegistration, correo: "bad-email" }, regions),
    ).not.toBe("");
    expect(
      validateRegistration({ ...validRegistration, password: "abc" }, regions),
    ).not.toBe("");
  });

  it("rejects a commune that does not belong to the selected region", () => {
    expect(
      validateRegistration({ ...validRegistration, comuna: "Otra comuna" }, regions),
    ).not.toBe("");
  });
});
