import { Link } from "react-router-dom";
import ProductImage from "./ProductImage.jsx";

export default function CategoryNavigation({ categories, products, selectedCategory }) {
  return (
    <nav className="row row-cols-2 row-cols-md-4 g-3 mb-5" aria-label="Categorías de productos">
      {categories.map((category) => (
        <div className="col" key={category}>
          <Link
            className={`card h-100 text-decoration-none text-center p-3 ${category === selectedCategory ? "border-primary" : ""}`}
            to={`/categorias?nombre=${encodeURIComponent(category)}`}
            aria-current={category === selectedCategory ? "page" : undefined}
          >
            <ProductImage
              product={products.find((product) => product.categoria === category)}
              className="d-block mx-auto object-fit-cover rounded mb-2"
              width="100"
              height="100"
              alt={`Productos de ${category}`}
            />
            <span className="fw-semibold">{category}</span>
          </Link>
        </div>
      ))}
    </nav>
  );
}
