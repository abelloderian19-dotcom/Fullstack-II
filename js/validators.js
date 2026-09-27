const EMAIL_MAX_LENGTH = 100;
const ALLOWED_EMAIL_DOMAINS = ["profesor.duoc.cl", "duoc.cl", "gmail.com"];

const PASSWORD_MIN_LENGTH = 4;
const PASSWORD_MAX_LENGTH = 10;

const NAME_MAX_LENGTH = 100;

const COMMENT_MAX_LENGTH = 500;

function validarCorreo(correo) {
    return ALLOWED_EMAIL_DOMAINS.some((dominio) => correo.endsWith(dominio)) &&
        correo.length <= EMAIL_MAX_LENGTH;
}

function validarPassword(password) {
    return password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH;
}

function validarNombre(nombre) {
    return nombre.length <= NAME_MAX_LENGTH;
}

function validarComentario(comentario) {
    return comentario.length <= COMMENT_MAX_LENGTH;
}
