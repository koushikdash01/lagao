import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { Layout } from "./components/Layout";
import { StoreProvider } from "./lib/store";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { PlantDetails } from "./pages/PlantDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { AuthPage } from "./pages/Auth";
import { Notifications, Orders, Profile, Recommendations, Wishlist } from "./pages/Account";
import { StaticPage } from "./pages/StaticPages";

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/plants/:id" element={<PlantDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
          <Route path="/reset-password" element={<AuthPage mode="reset" />} />
          <Route path="/verify-email" element={<AuthPage mode="verify" />} />
          <Route path="/about" element={<StaticPage slug="about" />} />
          <Route path="/contact" element={<StaticPage slug="contact" />} />
          <Route path="/faqs" element={<StaticPage slug="faqs" />} />
          <Route path="/pages/:slug" element={<PolicyRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </StoreProvider>
  );
}

function PolicyRoute() {
  const { slug = "about" } = useParams();
  return <StaticPage slug={slug} />;
}
