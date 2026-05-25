import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../api/http.js";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout() {
  const user = useSelector((state) => state.auth.user);
  const totals = useSelector((state) => state.cart.totals);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const place = async () => {
    if (placing) return;
    setPlacing(true);
    try {
      const addressId = user?.addresses?.[0]?._id;
      const { data } = await api.post("/orders", { addressId, paymentMethod });

      if (paymentMethod === "razorpay") {
        const loaded = await loadRazorpayScript();
        if (!loaded) throw new Error("Razorpay checkout failed to load");

        const payment = await api.post(`/orders/${data.order._id}/payment`);
        const { razorpayOrder, key } = payment.data;

        const gateway = new window.Razorpay({
          key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "QuickKart",
          description: `Order ${data.order.orderNumber}`,
          order_id: razorpayOrder.id,
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.phone
          },
          handler: async (response) => {
            await api.post("/orders/payment/verify", {
              orderId: data.order._id,
              ...response
            });
            toast.success("Payment verified");
            navigate(`/tracking/${data.order._id}`);
          },
          modal: {
            ondismiss: () => toast("Payment window closed. Order is saved as pending.")
          },
          theme: { color: "#10b981" }
        });

        gateway.open();
        return;
      }

      toast.success("Order placed");
      navigate(`/tracking/${data.order._id}`);
    } catch (error) {
      toast.error(error.message || "Unable to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <main className="container-shell grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
      <section className="panel">
        <h1 className="text-2xl font-black">Checkout</h1>
        <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm font-bold text-emerald-800 ring-1 ring-emerald-100">
          Estimated delivery in 10-20 minutes after store confirmation.
        </div>
        <div className="mt-5 rounded-lg border p-4">
          <p className="font-bold">Delivery address</p>
          <p className="mt-1 text-sm text-slate-600">{user?.addresses?.[0] ? `${user.addresses[0].line1}, ${user.addresses[0].city}` : "Add an address in profile before ordering."}</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {["cod", "razorpay"].map((method) => (
            <button className={`rounded-lg border p-4 text-left font-bold ${paymentMethod === method ? "border-quick-green bg-emerald-50" : "border-slate-200"}`} key={method} onClick={() => setPaymentMethod(method)}>
              {method === "cod" ? "Cash on delivery" : "Online payment"}
            </button>
          ))}
        </div>
      </section>
      <aside className="panel h-fit">
        <p className="flex justify-between text-lg font-black"><span>Payable</span><span>Rs {totals.total}</span></p>
        <button className="btn-primary mt-5 w-full" disabled={placing} onClick={place}>
          {placing ? "Placing order..." : "Place order"}
        </button>
      </aside>
    </main>
  );
}
