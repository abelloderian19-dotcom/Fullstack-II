import { useStore } from "../context/StoreContext.jsx";
import CartItemsTable from "../components/CartItemsTable.jsx";
import CartProductCatalog from "../components/CartProductCatalog.jsx";

export default function CartPage() {
  const {
    products,
    cartItems,
    cartTotal,
    setCartQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  return (
    <main className="container py-4 py-lg-5">
      <h1 className="h2 text-primary mb-4">Carrito de compras</h1>
      <div className="row g-4 align-items-start">
        <CartProductCatalog products={products} />
        <CartItemsTable
          items={cartItems}
          total={cartTotal}
          setQuantity={setCartQuantity}
          removeItem={removeFromCart}
          clear={clearCart}
        />
      </div>
    </main>
  );
}
