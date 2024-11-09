import React from "react";
import { Route, Routes } from "react-router";
import AdminOrderPage from "../page/AdminOrderPage/AdminOrderPage";
import AdminProduct from "../page/AdminProductPage/AdminProductPage";
import CartPage from "../page/CartPage/CartPage";
import Login from "../page/LoginPage/LoginPage";
import MyPage from "../page/MyPage/MyPage";
import MyLikePage from "../page/MyLikePage/MyLikePage";
import CategoryPage from "../page/LandingPage/components/CategoryPage";
import OrderCompletePage from "../page/OrderCompletePage/OrderCompletePage";
import PaymentPage from "../page/PaymentPage/PaymentPage";
import ProductAll from "../page/LandingPage/LandingPage";
import ProductDetail from "../page/ProductDetailPage/ProductDetailPage";
import RegisterPage from "../page/RegisterPage/RegisterPage";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductAll />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products/category/:category" element={<CategoryPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route element={<PrivateRoute permissionLevel="customer" />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<OrderCompletePage />} />
        <Route path="/account/purchase" element={<MyPage />} />
        <Route path="/favorites" element={<MyLikePage />} />
      </Route>
      <Route element={<PrivateRoute permissionLevel="admin" />}>
        <Route path="/admin/product" element={<AdminProduct />} />
        <Route path="/admin/order" element={<AdminOrderPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
