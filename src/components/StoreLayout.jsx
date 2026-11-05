import { Outlet } from "react-router-dom";
import SiteFooter from "./SiteFooter.jsx";
import Navbar from "./Navbar.jsx";

export default function StoreLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <SiteFooter />
    </>
  );
}
