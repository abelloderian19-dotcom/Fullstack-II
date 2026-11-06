export default function CheckoutDeliveryFields({
  address,
  errors,
  regions,
  selectedRegion,
  onChange,
  onBlur,
}) {
  return (
    <section className="row g-3" aria-labelledby="checkout-delivery-title">
      <div className="col-12 mt-4"><h2 className="h5 mb-0" id="checkout-delivery-title">Dirección de entrega</h2></div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="checkout-street">Calle y número*</label>
        <input className={`form-control${errors.calle ? " is-invalid" : ""}`} id="checkout-street" name="calle" value={address.calle} onChange={onChange} onBlur={onBlur} required maxLength="200" aria-invalid={Boolean(errors.calle)} />
        {errors.calle && <div className="invalid-feedback" role="alert">{errors.calle}</div>}
      </div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="checkout-department">Departamento</label>
        <input className={`form-control${errors.departamento ? " is-invalid" : ""}`} id="checkout-department" name="departamento" value={address.departamento} onChange={onChange} onBlur={onBlur} maxLength="50" aria-invalid={Boolean(errors.departamento)} />
        {errors.departamento && <div className="invalid-feedback" role="alert">{errors.departamento}</div>}
      </div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="checkout-region">Región*</label>
        <select className={`form-select${errors.region ? " is-invalid" : ""}`} id="checkout-region" name="region" value={address.region} onChange={onChange} onBlur={onBlur} required aria-invalid={Boolean(errors.region)}>
          <option value="">Selecciona una región</option>
          {regions.map((region) => <option key={region.nombre}>{region.nombre}</option>)}
        </select>
        {errors.region && <div className="invalid-feedback" role="alert">{errors.region}</div>}
      </div>
      <div className="col-12 col-md-6">
        <label className="form-label" htmlFor="checkout-commune">Comuna*</label>
        <select className={`form-select${errors.comuna ? " is-invalid" : ""}`} id="checkout-commune" name="comuna" value={address.comuna} onChange={onChange} onBlur={onBlur} required disabled={!selectedRegion} aria-invalid={Boolean(errors.comuna)}>
          <option value="">Selecciona una comuna</option>
          {selectedRegion?.comunas.map((commune) => <option key={commune}>{commune}</option>)}
        </select>
        {errors.comuna && <div className="invalid-feedback" role="alert">{errors.comuna}</div>}
      </div>
      <div className="col-12">
        <label className="form-label" htmlFor="checkout-notes">Indicaciones para la entrega</label>
        <textarea className={`form-control${errors.indicaciones ? " is-invalid" : ""}`} id="checkout-notes" name="indicaciones" value={address.indicaciones} onChange={onChange} onBlur={onBlur} rows="3" maxLength="500" aria-invalid={Boolean(errors.indicaciones)} />
        {errors.indicaciones && <div className="invalid-feedback" role="alert">{errors.indicaciones}</div>}
      </div>
    </section>
  );
}
