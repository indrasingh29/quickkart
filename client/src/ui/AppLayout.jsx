import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice.js";
import FloatingCart from "./FloatingCart.jsx";

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-[#f7f8f5] pb-24">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container-shell flex min-h-16 items-center gap-4 py-3">
          <Link to="/" className="shrink-0 text-2xl font-black tracking-normal text-quick-green">
            QuickKart
          </Link>
          <div className="hidden min-w-48 text-sm md:block">
            <p className="font-black text-slate-900">Delivery in 10-20 mins</p>
            <p className="truncate text-slate-500">Indiranagar, Bengaluru</p>
          </div>
          <Link
            to="/search"
            className="hidden min-w-0 flex-1 rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-50 lg:block"
          >
            Search for milk, fruits, snacks and more
          </Link>
          <nav className="ml-auto hidden items-center gap-5 text-sm font-semibold md:flex">
            <NavLink to="/categories">Categories</NavLink>
            <NavLink to="/offers">Offers</NavLink>
            <NavLink to="/orders">Orders</NavLink>
            {user ? (
              <button
                className="btn-muted"
                onClick={() => {
                  dispatch(logout());
                  navigate("/");
                }}
              >
                Logout
              </button>
            ) : (
              <Link className="btn-primary" to="/login">
                Login
              </Link>
            )}
          </nav>
        </div>
        <div className="container-shell flex gap-2 pb-3 md:hidden">
          <Link className="btn-muted flex-1" to="/search">
            Search groceries
          </Link>
          <Link className="btn-primary flex-1" to={user ? "/profile" : "/login"}>
            {user ? "Profile" : "Login"}
          </Link>
        </div>
      </header>
      <Outlet />
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white md:hidden">
        <div className="grid grid-cols-4 text-center text-xs font-bold text-slate-600">
          <Link className="py-3" to="/">Home</Link>
          <Link className="py-3" to="/categories">Categories</Link>
          <Link className="py-3" to="/orders">Orders</Link>
          <Link className="py-3" to={user ? "/profile" : "/login"}>{user ? "Profile" : "Login"}</Link>
        </div>
      </nav>
      <FloatingCart />
    </div>
  );
}
