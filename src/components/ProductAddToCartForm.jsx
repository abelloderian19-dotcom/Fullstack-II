import { useState } from "react";
import { useStore } from "../context/StoreContext.jsx";

export default function ProductAddToCartForm({ product }) {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState("1");
  const [feedback, setFeedback] = useState("");

  function submit(event) {
    event.preventDefault();
    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 99) {
      setFeedback("Ingresa una cantidad entre 1 y 99.");
      return;
    }

    const added = addToCart(product.codigo, parsedQuantity);
    setFeedback(
      added
        ? "Añadido al carrito."
        : "No se pudo añadir: revisa el stock y el límite de 99 unidades.",
    );
  }

  return (
    <form className="border-bottom pb-4" onSubmit={submit}>
      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <label className="form-label mb-0" htmlFor="detail-quantity">Cantidad</label>
        <input
          className="form-control w-auto"
          id="detail-quantity"
          type="number"
          min="1"
          max={Number.isFinite(product.stock) ? Math.min(99, product.stock) : 99}
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          required
        />
      </div>
      <button className="btn btn-primary w-100" type="submit" disabled={product.stock === 0}>
        {product.stock === 0 ? "Agotado" : "Añadir al carrito"}
      </button>
      {feedback && <p className="small mt-2 mb-0" role="status">{feedback}</p>}
    </form>
  );
}
