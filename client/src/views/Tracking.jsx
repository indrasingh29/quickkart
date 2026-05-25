import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSocket } from "../api/socket.js";
import { api } from "../api/http.js";

export default function Tracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    api.get("/orders").then(({ data }) => setOrder(data.orders.find((entry) => entry._id === id)));
    const socket = getSocket();
    socket.emit("order:join", id);
    socket.on("order:update", setOrder);
    socket.on("delivery:location", setLocation);
    return () => {
      socket.off("order:update", setOrder);
      socket.off("delivery:location", setLocation);
    };
  }, [id]);

  if (!order) return <div className="screen-center">Loading tracking...</div>;
  const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapQuery = location
    ? `${location.lat},${location.lng}`
    : [order.address?.line1, order.address?.city, order.address?.state].filter(Boolean).join(",");

  return (
    <main className="container-shell py-8">
      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Order {order.orderNumber}</p>
            <h1 className="text-2xl font-black capitalize">{order.status.replaceAll("_", " ")}</h1>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Live</span>
        </div>
        {mapsKey && mapQuery ? (
          <iframe
            className="mt-6 h-80 w-full rounded-lg border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${encodeURIComponent(mapQuery)}`}
            title="Live delivery map"
          />
        ) : (
          <div className="mt-6 grid min-h-72 place-items-center rounded-lg bg-slate-100">
            <div className="text-center">
              <p className="text-lg font-black">Map tracking</p>
              <p className="mt-1 text-sm text-slate-500">
                {location ? `Rider at ${location.lat}, ${location.lng}` : "Add VITE_GOOGLE_MAPS_API_KEY to show embedded Google Maps."}
              </p>
            </div>
          </div>
        )}
        <div className="mt-6 grid gap-3">
          {order.timeline.map((event, index) => (
            <div className="flex gap-3" key={`${event.status}-${index}`}>
              <span className="mt-1 h-3 w-3 rounded-full bg-quick-green" />
              <div>
                <p className="font-bold capitalize">{event.status.replaceAll("_", " ")}</p>
                <p className="text-sm text-slate-500">{event.message}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
