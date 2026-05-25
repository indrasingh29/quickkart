import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice.js";
import { useDebounce } from "../hooks/useDebounce.js";
import ProductCard from "../ui/ProductCard.jsx";
import SkeletonGrid from "../ui/SkeletonGrid.jsx";

export default function Search() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search);
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ search: debounced, category: params.get("category") || undefined }));
  }, [dispatch, debounced, params]);

  return (
    <main className="container-shell py-6">
      <input className="input" autoFocus placeholder="Search atta, milk, fruits..." value={search} onChange={(event) => setSearch(event.target.value)} />
      <div className="mt-6">{loading ? <SkeletonGrid /> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{items.map((product) => <ProductCard key={product._id} product={product} />)}</div>}</div>
    </main>
  );
}
