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
