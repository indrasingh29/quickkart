import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/http.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api.get("/orders").then(({ data }) => setOrders(data.orders));
  }, []);

  return (
    <main className="container-shell py-8">
      <h1 className="text-2xl font-black">Orders</h1>
      <div className="mt-5 grid gap-3">
        {orders.map((order) => (
          <Link className="panel flex items-center justify-between" key={order._id} to={`/tracking/${order._id}`}>
            <div>
              <p className="font-black">{order.orderNumber}</p>
              <p className="text-sm text-slate-500">{order.items.length} items - {order.status}</p>
            </div>
            <p className="font-black">Rs {order.pricing.total}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
