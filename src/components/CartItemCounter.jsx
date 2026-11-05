import ActionButton from "./ActionButton.jsx";

export default function CartItemCounter({
  clicks,
  setClicks,
  maxClicks,
  productName,
}) {
  return (
    <div className="d-flex align-items-center gap-2">
      <ActionButton
        className="btn btn-outline-secondary btn-sm"
        aria-label={"Reducir cantidad de " + productName}
        disabled={clicks <= 1}
        onClick={() => setClicks((valorClicks) => valorClicks - 1)}
      >
        {"\u2212"}
      </ActionButton>
      <span aria-label={clicks + (clicks === 1 ? " unidad" : " unidades")}>
        {clicks}
      </span>
      <ActionButton
        className="btn btn-outline-secondary btn-sm"
        aria-label={"Aumentar cantidad de " + productName}
        disabled={clicks >= maxClicks}
        onClick={() => setClicks((valorClicks) => valorClicks + 1)}
      >
        +
      </ActionButton>
    </div>
  );
}
