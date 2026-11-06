import { useState } from "react";
import { useStore } from "../context/StoreContext.jsx";
import ActionButton from "./ActionButton.jsx";

export default function AddToCartButton({
  product,
  className = "btn btn-primary btn-sm",
  label = "Agregar al carrito",
}) {
  const { addToCart } = useStore();
  const [feedback, setFeedback] = useState("");
  const [hasError, setHasError] = useState(false);

  function addProduct() {
    const added = addToCart(product.codigo);
    setHasError(!added);
    setFeedback(
      added
        ? "Añadido al carrito."
        : "No se pudo añadir: revisa el stock y el límite de 99 unidades.",
    );
  }

  return (
    <>
      <ActionButton
        className={className}
        onClick={addProduct}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? "Agotado" : label}
      </ActionButton>
      {feedback && (
        <p
          className={`small mt-2 mb-0 text-center ${hasError ? "text-danger" : "text-success"}`}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      )}
    </>
  );
}
