import { Link, useParams } from "react-router-dom";
import { getOrders } from "../data/database.js";
import { formatPrice } from "../utils/pricing.js";

export default function PaymentResultPage() {
  const { result, orderId } = useParams();
  const order = getOrders().find((entry) => entry.id === orderId);
  const succeeded = result === "exitoso";

  if (!order) {
    return (
      <main className="container py-5">
        <p className="alert alert-warning">
          No encontramos el resumen de esta compra.{" "}
          <Link to="/">Volver al inicio</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="container py-4 py-lg-5">
      <section className="card shadow-sm receipt-panel mx-auto">
        <div className="card-body p-3 p-md-4">
          <header className="d-flex flex-wrap justify-content-between gap-3 mb-3">
            <div>
              <h1 className={`h3 ${succeeded ? "text-success" : "text-danger"}`}>
                {succeeded ? "✓ Se ha realizado la compra" : "× No se pudo realizar el pago"}
              </h1>
              <p className="mb-0 text-secondary">
                {succeeded ? "Gracias por comprar en Pastelería 1000 Sabores." : "Revisa los datos o vuelve a intentar el pago."}
              </p>
            </div>
            <span className="text-secondary">Orden {order.id}</span>
          </header>
          {!succeeded && (
            <Link className="btn btn-success mb-3" to="/checkout">
              Volver a realizar el pago
            </Link>
          )}
          <h2 className="h5">Información del cliente</h2>
          <dl className="row border-bottom pb-3">
            <dt className="col-sm-3">Nombre</dt>
            <dd className="col-sm-9">{order.cliente.nombre} {order.cliente.apellidos}</dd>
            <dt className="col-sm-3">Correo</dt>
            <dd className="col-sm-9">{order.cliente.correo}</dd>
            <dt className="col-sm-3">Dirección</dt>
            <dd className="col-sm-9">
              {order.envio.calle}{order.envio.departamento ? `, ${order.envio.departamento}` : ""}, {order.envio.comuna}, {order.envio.region}
            </dd>
            <dt className="col-sm-3">Entrega</dt>
            <dd className="col-sm-9">{order.envio.entrega}</dd>
          </dl>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.codigo}>
                    <td>{item.nombre}</td>
                    <td>{formatPrice(item.precio)}</td>
                    <td>{item.cantidad}</td>
                    <td>{formatPrice(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="h5 text-center bg-light rounded p-3">
            Total {succeeded ? "pagado" : "pendiente"}: {formatPrice(order.total)}
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {succeeded && (
              <button className="btn btn-outline-primary" type="button" onClick={() => window.print()}>
                Imprimir comprobante
              </button>
            )}
            <Link className="btn btn-primary" to="/productos">
              Seguir comprando
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
