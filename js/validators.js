function esRequerido(valor) {
    if (valor.trim() === "") return "Este campo es obligatorio";
    return null;
}

function largoMinimo(valor, min) {
    if (valor.length < min) return `Debe tener al menos ${min} caracteres`;
    return null;
}

function largoMaximo(valor, max) {
    if (valor.length > max) return `Máximo ${max} caracteres (llevas ${valor.length})`;
    return null;
}

function esEntero(valor) {
    if (!/^\d+$/.test(valor)) return "Debe ser un número entero, sin decimales";
    return null;
}

function esDecimal(valor) {
    if (!/^\d+([.,]\d+)?$/.test(valor)) return "Debe ser un número, por ejemplo 4500 o 4500.50";
    return null;
}

function esMayorIgualQue(valor, min) {
    if (Number(valor.replace(",", ".")) < min) return `Debe ser mayor o igual a ${min}`;
    return null;
}

function dominioPermitido(correo) {
    const dominios = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];
    const permitido = dominios.some((dominio) => correo.endsWith("@" + dominio));
    if (!permitido) return "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com";
    return null;
}

// Valida un RUN chileno sin puntos ni guion, por ejemplo 12345678K
// El dígito verificador se calcula con el algoritmo módulo 11
function validarRun(run) {
    if (!/^\d{6,8}[0-9K]$/i.test(run)) return "El RUN debe tener solo números y el dígito verificador, sin puntos ni guion";

    const cuerpo = run.slice(0, -1);
    const dv = run.slice(-1).toUpperCase();

    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const resto = 11 - (suma % 11);
    const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);

    if (dv !== dvEsperado) return "El RUN no es válido, revisa el dígito verificador";
    return null;
}
