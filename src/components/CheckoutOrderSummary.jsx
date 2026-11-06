import { effectivePrice, formatPrice } from "../utils/pricing.js";
import ProductImage from "./ProductImage.jsx";

export default function CheckoutOrderSummary({
  items,
  subtotal,
  discount,
}) {
  return (
    <>
      <div className="table-responsive mb-4">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th scope="col">Imagen</th>
              <th scope="col">Nombre</th>
              <th scope="col">Precio</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ codigo, cantidad, product }) => (
              <tr key={codigo}>
                <td>
                  <ProductImage
                    product={product}
                    alt=""
                    className="object-fit-cover"
                    width="48"
                    height="48"
                  />
                </td>
                <td>{product.nombre}</td>
                <td>{formatPrice(effectivePrice(product))}</td>
                <td>{cantidad}</td>
                <td>{formatPrice(effectivePrice(product) * cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {discount > 0 && (
        <p className="d-flex justify-content-between border-top pt-3">
          <span>Subtotal antes del descuento</span><span>{formatPrice(subtotal)}</span>
        </p>
      )}
    </>
  );
}
