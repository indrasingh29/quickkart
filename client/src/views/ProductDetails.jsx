import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../api/http.js";
import { updateCartItem } from "../store/slices/cartSlice.js";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data.product));
  }, [id]);

  if (!product) return <div className="screen-center">Loading product...</div>;

  return (
    <main className="container-shell grid gap-8 py-8 md:grid-cols-2">
      <img className="aspect-square w-full rounded-lg bg-white object-cover shadow-soft" src={product.images?.[0]} alt={product.name} />
      <section>
        <p className="text-sm font-bold text-quick-green">{product.category?.name}</p>
        <h1 className="mt-2 text-3xl font-black">{product.name}</h1>
        <p className="mt-3 text-slate-600">{product.description}</p>
        <p className="mt-6 text-3xl font-black">Rs {product.price}</p>
        <p className="text-sm text-slate-400 line-through">Rs {product.mrp}</p>
        <button
          className="btn-primary mt-6 w-full md:w-auto"
          onClick={async () => {
            await dispatch(updateCartItem({ productId: product._id, quantity: 1 })).unwrap();
            toast.success("Added to cart");
          }}
        >
          Add to cart
        </button>
      </section>
    </main>
  );
}
