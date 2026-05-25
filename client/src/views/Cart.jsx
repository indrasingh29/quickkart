import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItem } from "../store/slices/cartSlice.js";

export default function Cart() {
  const dispatch = useDispatch();
  const { cart, totals } = useSelector((state) => state.cart);
  const items = cart.items || [];

  return (
    <main className="container-shell grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
      <section className="panel">
        <h1 className="text-2xl font-black">Your cart</h1>
        <div className="mt-4 divide-y">
          {items.map((item) => (
            <div className="flex gap-3 py-4" key={item.product._id}>
              <img className="h-20 w-20 rounded-lg object-cover" src={item.product.images?.[0]} alt={item.product.name} />
              <div className="flex-1">
                <p className="font-bold">{item.product.name}</p>
                <p className="text-sm text-slate-500">{item.product.unit}</p>
                <p className="mt-1 font-black">Rs {item.product.price}</p>
              </div>
              <div className="flex h-9 items-center rounded-lg border">
                <button className="px-3" onClick={() => dispatch(updateCartItem({ productId: item.product._id, quantity: item.quantity - 1 }))}>-</button>
                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                <button className="px-3" onClick={() => dispatch(updateCartItem({ productId: item.product._id, quantity: item.quantity + 1 }))}>+</button>
              </div>
            </div>
          ))}
          {!items.length && <p className="py-10 text-center text-slate-500">Your cart is waiting for fresh picks.</p>}
        </div>
      </section>
      <aside className="panel h-fit">
        <h2 className="font-black">Bill details</h2>
        <div className="mt-4 space-y-2 text-sm">
          <p className="flex justify-between"><span>Subtotal</span><span>Rs {totals.subtotal}</span></p>
          <p className="flex justify-between"><span>Delivery</span><span>Rs {totals.deliveryFee}</span></p>
          <p className="flex justify-between text-quick-green"><span>Discount</span><span>- Rs {totals.discount}</span></p>
          <p className="flex justify-between border-t pt-3 text-lg font-black"><span>Total</span><span>Rs {totals.total}</span></p>
        </div>
        <Link className="btn-primary mt-5 w-full" to="/checkout">Checkout</Link>
      </aside>
    </main>
  );
}
