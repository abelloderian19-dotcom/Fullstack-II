export default function CheckoutPaymentOptions({
  address,
  simulateFailure,
  onAddressChange,
  onFailureChange,
}) {
  return (
    <section className="row g-3" aria-labelledby="checkout-payment-title">
      <div className="col-12 mt-4"><h2 className="h5 mb-0" id="checkout-payment-title">Pago y entrega</h2></div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="checkout-delivery-option">Opción de entrega</label>
        <select className="form-select" id="checkout-delivery-option" name="entrega" value={address.entrega} onChange={onAddressChange}>
          <option value="estandar">Entrega estándar (2 a 3 días) — sin costo</option>
          <option value="express">Entrega express (día siguiente)</option>
          <option value="retiro">Retiro en tienda</option>
        </select>
      </div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="checkout-payment-method">Medio de pago</label>
        <select className="form-select" id="checkout-payment-method" name="pago" value={address.pago} onChange={onAddressChange}>
          <option value="tarjeta">Tarjeta (demostración)</option>
          <option value="transferencia">Transferencia</option>
          <option value="efectivo">Efectivo al recibir</option>
        </select>
      </div>
      <div className="col-12">
        <div className="form-check">
          <input className="form-check-input" id="simulate-payment-failure" type="checkbox" checked={simulateFailure} onChange={(event) => onFailureChange(event.target.checked)} />
          <label className="form-check-label" htmlFor="simulate-payment-failure">
            Simular rechazo del pago (solo demostración)
          </label>
        </div>
      </div>
    </section>
  );
}
