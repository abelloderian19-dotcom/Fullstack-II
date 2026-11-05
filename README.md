# Pastelería 1000 Sabores

Aplicación de demostración migrada a React, React Router y Bootstrap. El catálogo,
las cuentas y las órdenes se guardan en `localStorage`; no hay servidor ni
procesamiento real de pagos. No ingreses datos personales o de pago reales.

## Desarrollo

Requiere Node.js 20 o superior.

```sh
npm install
npm run dev
```

El panel usa las cuentas de prueba `ana.perez@duoc.cl` / `admin123` y
`maria.gonzalez@gmail.com` / `cliente1`.

## Pruebas y producción

Las pruebas unitarias de componentes, eventos, formularios y persistencia usan
Jasmine y Karma con jsdom:

```sh
npm test
npm run build
npm run preview
```

## Vistas

- Tienda: inicio, productos, categorías, ofertas, detalle, carrito y checkout.
- Compra: resumen de éxito y rechazo; el formulario permite simular un rechazo.
- Contenido: nosotros, contacto, blogs y detalle de artículos.
- Administración: dashboard, órdenes, productos, categorías, usuarios, reportes
  y perfil.

Los cambios CRUD y el carrito persisten en el navegador. Para volver a los datos
de demostración, borra el almacenamiento local del sitio.
