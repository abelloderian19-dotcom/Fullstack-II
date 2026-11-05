import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout.jsx";
import StoreLayout from "./components/StoreLayout.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import { AdminCategoriesPage, AdminDashboardPage, AdminOrderDetailPage, AdminOrdersPage, AdminProductFormPage, AdminProductsPage, AdminProfilePage, AdminReportsPage, AdminUserFormPage, AdminUsersPage } from "./pages/AdminPages.jsx";
import { LoginPage, RegisterPage } from "./pages/AuthPages.jsx";
import CartPage from "./pages/CartPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import { AboutPage, BlogDetailPage, BlogPage, ContactPage } from "./pages/ContentPages.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import OffersPage from "./pages/OffersPage.jsx";
import PaymentResultPage from "./pages/PaymentResultPage.jsx";
import ProductCatalogPage from "./pages/ProductCatalogPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";

function NotFoundPage() {
  return (
    <main className="container py-5">
      <h1 className="h2">Página no encontrada</h1>
      <p>La dirección solicitada no existe.</p>
    </main>
  );
}

function ApplicationRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="index.html" element={<HomePage />} />
        <Route path="productos" element={<ProductCatalogPage />} />
        <Route path="productos.html" element={<ProductCatalogPage />} />
        <Route path="categorias" element={<CategoryPage />} />
        <Route path="ofertas" element={<OffersPage />} />
        <Route path="producto/:code" element={<ProductDetailPage />} />
        <Route path="detalle.html" element={<ProductDetailPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="carrito.html" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="pago/:result/:orderId" element={<PaymentResultPage />} />
        <Route path="nosotros" element={<AboutPage />} />
        <Route path="nosotros.html" element={<AboutPage />} />
        <Route path="blogs" element={<BlogPage />} />
        <Route path="blogs.html" element={<BlogPage />} />
        <Route path="blogs/:articleId" element={<BlogDetailPage />} />
        <Route path="detalle-blog1.html" element={<BlogDetailPage />} />
        <Route path="detalle-blog2.html" element={<BlogDetailPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="contacto.html" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="login.html" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />
        <Route path="registro.html" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="index.html" element={<AdminDashboardPage />} />
        <Route path="productos" element={<AdminProductsPage />} />
        <Route path="productos.html" element={<AdminProductsPage />} />
        <Route path="productos/nuevo" element={<AdminProductFormPage />} />
        <Route path="productos/:code/editar" element={<AdminProductFormPage />} />
        <Route path="producto-form.html" element={<AdminProductFormPage />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="usuarios.html" element={<AdminUsersPage />} />
        <Route path="usuarios/nuevo" element={<AdminUserFormPage />} />
        <Route path="usuarios/:run/editar" element={<AdminUserFormPage />} />
        <Route path="usuario-form.html" element={<AdminUserFormPage />} />
        <Route path="categorias" element={<AdminCategoriesPage />} />
        <Route path="ordenes" element={<AdminOrdersPage />} />
        <Route path="ordenes/:orderId" element={<AdminOrderDetailPage />} />
        <Route path="reportes" element={<AdminReportsPage />} />
        <Route path="perfil" element={<AdminProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ApplicationRoutes />
      </BrowserRouter>
    </StoreProvider>
  );
}
