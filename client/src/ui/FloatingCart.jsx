import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function FloatingCart() {
  const { cart, totals } = useSelector((state) => state.cart);
  const count = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  if (!count) return null;
  return (
    <Link
      to="/cart"
      className="fixed bottom-16 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-lg bg-quick-green px-5 py-3 font-bold text-white shadow-2xl md:bottom-5"
    >
      <span>{count} items</span>
      <span>View cart - Rs {totals.total}</span>
    </Link>
  );
}
