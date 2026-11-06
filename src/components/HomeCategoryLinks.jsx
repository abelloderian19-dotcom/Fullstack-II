import { Link } from "react-router-dom";

export default function HomeCategoryLinks({ categories }) {
  return (
    <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
      {categories.slice(0, 4).map((category) => (
        <div className="col" key={category}>
          <Link
            className="btn btn-light border w-100 h-100 py-3"
            to={`/categorias?nombre=${encodeURIComponent(category)}`}
          >
            {category}
          </Link>
        </div>
      ))}
    </div>
  );
}
