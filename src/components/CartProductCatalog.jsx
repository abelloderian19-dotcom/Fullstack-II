import { effectivePrice, formatPrice } from "../utils/pricing.js";
import AddToCartButton from "./AddToCartButton.jsx";
import ProductImage from "./ProductImage.jsx";

export default function CartProductCatalog({ products }) {
  return (
    <section className="col-12 col-lg-6" aria-labelledby="cart-catalog-title">
      <h2 className="h4 mb-3" id="cart-catalog-title">Lista de productos</h2>
      <div className="row row-cols-1 row-cols-sm-2 g-3">
        {products.map((product) => (
          <div className="col" key={product.codigo}>
            <article className="card h-100">
              <ProductImage
                product={product}
                className="card-img-top object-fit-cover"
                width="400"
                height="300"
              />
              <div className="card-body d-flex flex-column">
                <h3 className="h6 card-title">{product.nombre}</h3>
                <p className="small text-secondary mb-1">{product.categoria}</p>
                <p className="mb-2">
                  {product.descuento > 0 && (
                    <del className="small text-secondary me-2">
                      {formatPrice(product.precio)}
                    </del>
                  )}
                  <strong>{formatPrice(effectivePrice(product))}</strong>
                </p>
                <p className="small text-secondary mt-auto mb-2">
                  Stock disponible: {product.stock}
                </p>
                <AddToCartButton product={product} label="Agregar" />
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
