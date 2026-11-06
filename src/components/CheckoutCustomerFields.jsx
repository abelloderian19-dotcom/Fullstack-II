export default function CheckoutCustomerFields({ address, errors, onChange, onBlur }) {
  return (
    <section className="row g-3" aria-labelledby="checkout-customer-title">
      <div className="col-12"><h2 className="h5 mb-0" id="checkout-customer-title">Información del cliente</h2></div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="checkout-name">Nombre*</label>
        <input className={`form-control${errors.nombre ? " is-invalid" : ""}`} id="checkout-name" name="nombre" value={address.nombre} onChange={onChange} onBlur={onBlur} required maxLength="50" aria-invalid={Boolean(errors.nombre)} />
        {errors.nombre && <div className="invalid-feedback" role="alert">{errors.nombre}</div>}
      </div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="checkout-lastname">Apellidos*</label>
        <input className={`form-control${errors.apellidos ? " is-invalid" : ""}`} id="checkout-lastname" name="apellidos" value={address.apellidos} onChange={onChange} onBlur={onBlur} required maxLength="100" aria-invalid={Boolean(errors.apellidos)} />
        {errors.apellidos && <div className="invalid-feedback" role="alert">{errors.apellidos}</div>}
      </div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="checkout-email">Correo*</label>
        <input className={`form-control${errors.correo ? " is-invalid" : ""}`} id="checkout-email" type="email" name="correo" value={address.correo} onChange={onChange} onBlur={onBlur} required aria-invalid={Boolean(errors.correo)} />
        {errors.correo && <div className="invalid-feedback" role="alert">{errors.correo}</div>}
      </div>
    </section>
  );
}
