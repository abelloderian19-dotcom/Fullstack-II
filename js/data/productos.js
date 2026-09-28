// Categorías de productos (listado del caso)
const categorias = [
  "Tortas Cuadradas",
  "Tortas Circulares",
  "Postres Individuales",
  "Productos Sin Azúcar",
  "Pastelería Tradicional",
  "Productos Sin Gluten",
  "Productos Vegana",
  "Tortas Especiales",
];

// Datos de prueba: stock y stockCritico no vienen en el caso, se agregaron para el formulario
const productos = [
  {
    codigo: "TC001",
    imagen: "./img/products/web-TC001.jpg",
    categoria: "Tortas Cuadradas",
    nombre: "Torta Cuadrada de Chocolate",
    precio: 45000,
    stock: 10,
    stockCritico: 3,
    descripcion:
      "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.",
  },
  {
    codigo: "TC002",
    imagen: "./img/products/web-TC002.jpg",
    categoria: "Tortas Cuadradas",
    nombre: "Torta Cuadrada de Frutas",
    precio: 50000,
    stock: 8,
    stockCritico: 3,
    descripcion:
      "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.",
  },
  {
    codigo: "TT001",
    imagen: "./img/products/web-TT001.jpg",
    categoria: "Tortas Circulares",
    nombre: "Torta Circular de Vainilla",
    precio: 40000,
    stock: 12,
    stockCritico: 3,
    descripcion:
      "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.",
  },
  {
    codigo: "TT002",
    imagen: "./img/products/web-TT002.jpg",
    categoria: "Tortas Circulares",
    nombre: "Torta Circular de Manjar",
    precio: 42000,
    stock: 10,
    stockCritico: 3,
    descripcion:
      "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.",
  },
  {
    codigo: "PI001",
    imagen: "./img/products/web-PI001.jpg",
    categoria: "Postres Individuales",
    nombre: "Mousse de Chocolate",
    precio: 5000,
    stock: 30,
    stockCritico: 5,
    descripcion:
      "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.",
  },
  {
    codigo: "PI002",
    imagen: "./img/products/web-PI002.jpg",
    categoria: "Postres Individuales",
    nombre: "Tiramisú Clásico",
    precio: 5500,
    stock: 25,
    stockCritico: 5,
    descripcion:
      "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.",
  },
  {
    codigo: "PSA001",
    imagen: "./img/products/web-PSA001.jpg",
    categoria: "Productos Sin Azúcar",
    nombre: "Torta Sin Azúcar de Naranja",
    precio: 48000,
    stock: 6,
    stockCritico: 2,
    descripcion:
      "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.",
  },
  {
    codigo: "PSA002",
    imagen: "./img/products/web-PSA002.jpg",
    categoria: "Productos Sin Azúcar",
    nombre: "Cheesecake Sin Azúcar",
    precio: 47000,
    stock: 6,
    stockCritico: 2,
    descripcion:
      "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.",
  },
  {
    codigo: "PT001",
    imagen: "./img/products/web-PT001.jpg",
    categoria: "Pastelería Tradicional",
    nombre: "Empanada de Manzana",
    precio: 3000,
    stock: 40,
    stockCritico: 10,
    descripcion:
      "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.",
  },
  {
    codigo: "PT002",
    imagen: "./img/products/web-PT002.jpg",
    categoria: "Pastelería Tradicional",
    nombre: "Tarta de Santiago",
    precio: 6000,
    stock: 15,
    stockCritico: 5,
    descripcion:
      "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.",
  },
  {
    codigo: "PG001",
    imagen: "./img/products/web-PG001.jpg",
    categoria: "Productos Sin Gluten",
    nombre: "Brownie Sin Gluten",
    precio: 4000,
    stock: 20,
    stockCritico: 5,
    descripcion:
      "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.",
  },
  {
    codigo: "PG002",
    imagen: "./img/products/web-PG002.jpg",
    categoria: "Productos Sin Gluten",
    nombre: "Pan Sin Gluten",
    precio: 3500,
    stock: 18,
    stockCritico: 5,
    descripcion:
      "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.",
  },
  {
    codigo: "PV001",
    imagen: "./img/products/web-PV001.jpg",
    categoria: "Productos Vegana",
    nombre: "Torta Vegana de Chocolate",
    precio: 50000,
    stock: 5,
    stockCritico: 2,
    descripcion:
      "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.",
  },
  {
    codigo: "PV002",
    imagen: "./img/products/web-PV002.jpg",
    categoria: "Productos Vegana",
    nombre: "Galletas Veganas de Avena",
    precio: 4500,
    stock: 24,
    stockCritico: 6,
    descripcion:
      "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.",
  },
  {
    codigo: "TE001",
    imagen: "./img/products/web-TE001.jpg",
    categoria: "Tortas Especiales",
    nombre: "Torta Especial de Cumpleaños",
    precio: 55000,
    stock: 4,
    stockCritico: 2,
    descripcion:
      "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.",
  },
  {
    codigo: "TE002",
    imagen: "./img/products/web-TE002.jpg",
    categoria: "Tortas Especiales",
    nombre: "Torta Especial de Boda",
    precio: 60000,
    stock: 2,
    stockCritico: 1,
    descripcion:
      "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.",
  },
];
 




