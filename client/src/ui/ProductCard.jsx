import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { updateCartItem } from "../store/slices/cartSlice.js";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const add = async () => {
    try {
      await dispatch(updateCartItem({ productId: product._id, quantity: 1 })).unwrap();
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.message || "Login to add items");
    }
  };

  return (
    <motion.article layout className="group rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-100 transition hover:shadow-soft" whileHover={{ y: -3 }}>
      <Link to={`/products/${product._id}`}>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
          {discount > 0 && <span className="absolute left-2 top-2 rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-black text-white">{discount}% OFF</span>}
          <img className="h-full w-full object-cover transition duration-300 group-hover:scale-105" src={product.images?.[0]} alt={product.name} loading="lazy" />
        </div>
        <p className="mt-3 line-clamp-2 min-h-10 text-sm font-bold">{product.name}</p>
        <p className="mt-1 text-xs text-slate-500">{product.unit}</p>
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="font-black">Rs {product.price}</p>
          <p className="text-xs text-slate-400 line-through">Rs {product.mrp}</p>
        </div>
        <button className="rounded-lg border border-quick-green bg-emerald-50 px-3 py-1.5 text-sm font-black text-quick-green transition hover:bg-quick-green hover:text-white" onClick={add}>
          ADD
        </button>
      </div>
    </motion.article>
  );
}
