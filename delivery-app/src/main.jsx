import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import "./styles.css";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

function App() {
  const [token, setToken] = useState(localStorage.getItem("qk-rider-token") || "");
  const [email, setEmail] = useState("rider@quickkart.dev");
  const [password, setPassword] = useState("password123");
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);

  const authedApi = useMemo(() => {
    api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : "";
    return api;
  }, [token]);

  const load = async () => {
    const { data } = await authedApi.get("/delivery/orders");
    setOrders(data.orders);
    setEarnings(data.earnings);
  };

  useEffect(() => {
    if (!token) return;
    load();
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    const timer = window.setInterval(() => {
      navigator.geolocation?.getCurrentPosition(async (position) => {
        const payload = { lat: position.coords.latitude, lng: position.coords.longitude };
        await authedApi.post("/delivery/location", payload);
        orders.forEach((order) => socket.emit("delivery:location", { orderId: order._id, ...payload }));
      });
    }, 10000);
    return () => {
      window.clearInterval(timer);
      socket.disconnect();
    };
  }, [token, orders.length]);

  const login = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data.user.role !== "delivery_partner") throw new Error("Delivery partner role required");
      localStorage.setItem("qk-rider-token", data.token);
      setToken(data.token);
    } catch (error) {
      toast.error(error.message || error.response?.data?.message || "Login failed");
    }
  };

  const updateStatus = async (id, status) => {
    await authedApi.patch(`/orders/${id}/status`, { status });
    toast.success("Status updated");
    load();
  };

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center p-4">
        <form className="card w-full max-w-sm" onSubmit={login}>
          <h1 className="text-2xl font-black text-white">QuickKart Rider</h1>
          <input className="input mt-5" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input mt-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn mt-5 w-full">Login</button>
        </form>
        <Toaster />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Assigned deliveries</h1>
          <p className="text-slate-400">Earnings Rs {earnings}</p>
        </div>
        <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold" onClick={() => { localStorage.removeItem("qk-rider-token"); setToken(""); }}>
          Logout
        </button>
      </header>
      <section className="mt-6 grid gap-4">
        {orders.map((order) => (
          <article className="card" key={order._id}>
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-black text-white">{order.orderNumber}</p>
                <p className="text-sm text-slate-400">{order.address?.line1}, {order.address?.city}</p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-black text-emerald-300">{order.status}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn" onClick={() => updateStatus(order._id, "picked_up")}>Picked up</button>
              <button className="btn" onClick={() => updateStatus(order._id, "delivered")}>Delivered</button>
            </div>
          </article>
        ))}
        {!orders.length && <div className="card text-center text-slate-400">No assigned deliveries yet.</div>}
      </section>
      <Toaster />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
