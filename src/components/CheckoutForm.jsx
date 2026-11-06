import CheckoutCustomerFields from "./CheckoutCustomerFields.jsx";
import CheckoutDeliveryFields from "./CheckoutDeliveryFields.jsx";
import CheckoutPaymentOptions from "./CheckoutPaymentOptions.jsx";

export default function CheckoutForm({
  address,
  errors,
  regions,
  selectedRegion,
  simulateFailure,
  error,
  submitLabel,
  onAddressChange,
  onAddressBlur,
  onFailureChange,
  onSubmit,
}) {
  return (
    <form className="d-grid gap-3" onSubmit={onSubmit} noValidate>
      <CheckoutCustomerFields
        address={address}
        errors={errors}
        onChange={onAddressChange}
        onBlur={onAddressBlur}
      />
      <CheckoutDeliveryFields
        address={address}
        errors={errors}
        regions={regions}
        selectedRegion={selectedRegion}
        onChange={onAddressChange}
        onBlur={onAddressBlur}
      />
      <CheckoutPaymentOptions
        address={address}
        simulateFailure={simulateFailure}
        onAddressChange={onAddressChange}
        onFailureChange={onFailureChange}
      />
      {error && <p className="text-danger mb-0" role="alert">{error}</p>}
      <div className="d-flex justify-content-end">
        <button className="btn btn-success" type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}
