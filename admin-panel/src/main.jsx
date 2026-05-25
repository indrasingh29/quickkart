import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import "./styles.css";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

function App() {
  const [token, setToken] = useState(localStorage.getItem("qk-admin-token") || "");
  const [email, setEmail] = useState("admin@quickkart.dev");
  const [password, setPassword] = useState("password123");
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const authedApi = useMemo(() => {
    api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : "";
    return api;
  }, [token]);

  const load = async () => {
    const [stats, userRows, productRows] = await Promise.all([
      authedApi.get("/admin/analytics"),
      authedApi.get("/admin/users"),
      authedApi.get("/products?limit=20")
    ]);
    setAnalytics(stats.data.data);
    setUsers(userRows.data.users);
    setProducts(productRows.data.items);
  };

  useEffect(() => {
    if (!token) return;
    load().catch((error) => toast.error(error.response?.data?.message || "Unable to load dashboard"));
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    socket.on("admin:order", () => {
      toast.success("New order received");
      load();
    });
    return () => socket.disconnect();
  }, [token]);

  const login = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data.user.role !== "admin") throw new Error("Admin role required");
      localStorage.setItem("qk-admin-token", data.token);
      setToken(data.token);
      toast.success("Logged in");
    } catch (error) {
      toast.error(error.message || error.response?.data?.message || "Login failed");
    }
  };

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center p-4">
        <form className="card w-full max-w-sm" onSubmit={login}>
          <h1 className="text-2xl font-black">QuickKart Admin</h1>
          <input className="input mt-5" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input mt-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn mt-5 w-full">Login</button>
        </form>
        <Toaster />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Operations dashboard</h1>
          <p className="text-slate-500">Users, revenue, products, orders, and live events.</p>
        </div>
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white" onClick={() => { localStorage.removeItem("qk-admin-token"); setToken(""); }}>
          Logout
        </button>
      </header>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {["users", "products", "stores", "orders", "revenue"].map((key) => (
          <article className="card" key={key}>
            <p className="text-sm font-bold uppercase text-slate-500">{key}</p>
            <p className="mt-2 text-3xl font-black">{key === "revenue" ? `Rs ${analytics?.[key] || 0}` : analytics?.[key] || 0}</p>
          </article>
        ))}
      </section>
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="card">
          <h2 className="text-xl font-black">Recent orders</h2>
          <div className="mt-4 space-y-3">
            {analytics?.recentOrders?.map((order) => (
              <div className="flex justify-between rounded-lg bg-slate-50 p-3" key={order._id}>
                <span className="font-bold">{order.orderNumber}</span>
                <span>{order.status}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="card">
          <h2 className="text-xl font-black">User management</h2>
          <div className="mt-4 max-h-96 overflow-auto">
            {users.map((user) => (
              <div className="flex items-center justify-between border-b py-3" key={user._id}>
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.role}</p>
                </div>
                <button className="rounded-lg border px-3 py-1 text-sm font-bold" onClick={async () => { await authedApi.patch(`/admin/users/${user._id}/toggle-ban`); load(); }}>
                  {user.isBanned ? "Unban" : "Ban"}
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>
      <section className="card mt-6">
        <h2 className="text-xl font-black">Product inventory</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div className="rounded-lg border p-3" key={product._id}>
              <p className="font-bold">{product.name}</p>
              <p className="text-sm text-slate-500">Stock {product.stock} - Rs {product.price}</p>
            </div>
          ))}
        </div>
      </section>
      <Toaster />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
