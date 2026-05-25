import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchCategories, fetchProducts } from "../store/slices/productSlice.js";
import { syncCart } from "../store/slices/cartSlice.js";
import ProductCard from "../ui/ProductCard.jsx";
import SkeletonGrid from "../ui/SkeletonGrid.jsx";

export default function Home() {
  const dispatch = useDispatch();
  const { items, categories, loading } = useSelector((state) => state.products);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    if (token) dispatch(syncCart());
  }, [dispatch, token]);

  return (
    <main>
      <section className="bg-[#d9f99d]">
        <div className="container-shell grid gap-6 py-8 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-black uppercase tracking-widest text-emerald-700">Hyperlocal grocery delivery</p>
            <h1 className="mt-2 max-w-2xl text-4xl font-black leading-tight text-quick-ink sm:text-5xl">
              Daily essentials delivered while your tea is still hot.
            </h1>
            <p className="mt-4 max-w-xl text-base font-medium text-emerald-950/75">
              Fresh produce, dairy, snacks, and household basics from nearby stores with live order tracking.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary" to="/search">
                Shop now
              </Link>
              <Link className="btn-muted" to="/offers">
                View offers
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-lg bg-white/70 p-3 ring-1 ring-white">
                <p className="text-xl font-black">10-20</p>
                <p className="text-xs font-bold text-slate-600">min delivery</p>
              </div>
              <div className="rounded-lg bg-white/70 p-3 ring-1 ring-white">
                <p className="text-xl font-black">500+</p>
                <p className="text-xs font-bold text-slate-600">daily items</p>
              </div>
              <div className="rounded-lg bg-white/70 p-3 ring-1 ring-white">
                <p className="text-xl font-black">Live</p>
                <p className="text-xs font-bold text-slate-600">tracking</p>
              </div>
            </div>
          </motion.div>
          <div className="relative overflow-hidden rounded-lg bg-white p-3 shadow-soft">
            <img
              className="h-64 w-full rounded-lg object-cover md:h-80"
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
              alt="Fresh grocery basket"
            />
            <div className="absolute bottom-6 left-6 rounded-lg bg-white/95 p-4 shadow-soft">
              <p className="text-xs font-black uppercase text-emerald-600">Next basket</p>
              <p className="mt-1 text-lg font-black">Rs 50 off with QUICK50</p>
            </div>
          </div>
        </div>
      </section>
      <section className="container-shell -mt-4 grid gap-3 sm:grid-cols-3">
        {["No surge pricing", "Quality checked inventory", "COD and Razorpay ready"].map((item) => (
          <div className="rounded-lg bg-white p-4 text-sm font-black shadow-sm ring-1 ring-slate-100" key={item}>
            {item}
          </div>
        ))}
      </section>
      <section className="container-shell py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Shop by category</h2>
          <Link className="text-sm font-bold text-quick-green" to="/categories">
            See all
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Link className="min-w-36 rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-100" key={category._id} to={`/search?category=${category._id}`}>
              <img className="h-24 w-full rounded-lg object-cover" src={category.image} alt={category.name} />
              <p className="mt-2 text-sm font-bold">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="container-shell pb-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black">Recommended for you</h2>
            <p className="text-sm text-slate-500">Fast moving items from stores around you</p>
          </div>
          <Link className="hidden text-sm font-bold text-quick-green sm:block" to="/search">Browse all</Link>
        </div>
        {loading ? <SkeletonGrid /> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{items.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
      </section>
    </main>
  );
}
