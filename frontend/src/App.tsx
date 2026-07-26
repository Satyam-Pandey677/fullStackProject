import "./App.css";
import { Route, Routes } from "react-router-dom";

import SendEmail from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import VerifyPage from "./pages/Verify";
import AuthLayout from "./pages/Auth/AuthLayout";
import ProductsPage from "./pages/ProductsPage";
import ProductDetails from "./pages/ProductDetails.tsx";
import AdminLayout from "./pages/Admin/AdminLayout.tsx";
import AllUsers from "./pages/Admin/AllUsers.tsx";

function App() {

  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/sign-in" element={<SendEmail />} />
      <Route path="/send-otp" element={<VerifyPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/:id" element={<ProductDetails />} />
        <Route element={<AdminLayout />}>
          <Route path="/all-users" element={<AllUsers />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
