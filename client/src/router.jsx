import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "./ui/AppLayout.jsx";
import ProtectedRoute from "./ui/ProtectedRoute.jsx";

const Home = lazy(() => import("./views/Home.jsx"));
const Auth = lazy(() => import("./views/Auth.jsx"));
const ProductDetails = lazy(() => import("./views/ProductDetails.jsx"));
const Search = lazy(() => import("./views/Search.jsx"));
const Cart = lazy(() => import("./views/Cart.jsx"));
const Checkout = lazy(() => import("./views/Checkout.jsx"));
const Orders = lazy(() => import("./views/Orders.jsx"));
const Tracking = lazy(() => import("./views/Tracking.jsx"));
const Profile = lazy(() => import("./views/Profile.jsx"));
const Wishlist = lazy(() => import("./views/Wishlist.jsx"));
const Categories = lazy(() => import("./views/Categories.jsx"));
const Offers = lazy(() => import("./views/Offers.jsx"));
const NotFound = lazy(() => import("./views/NotFound.jsx"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Auth mode="login" /> },
      { path: "register", element: <Auth mode="register" /> },
      { path: "products/:id", element: <ProductDetails /> },
      { path: "search", element: <Search /> },
      { path: "categories", element: <Categories /> },
      { path: "offers", element: <Offers /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "cart", element: <Cart /> },
          { path: "checkout", element: <Checkout /> },
          { path: "orders", element: <Orders /> },
          { path: "tracking/:id", element: <Tracking /> },
          { path: "profile", element: <Profile /> },
          { path: "wishlist", element: <Wishlist /> }
        ]
      },
      { path: "logout", element: <Navigate to="/" replace /> },
      { path: "*", element: <NotFound /> }
    ]
  }
]);
