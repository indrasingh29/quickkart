import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/slices/productSlice.js";

export default function Categories() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.products.categories);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  return (
    <main className="container-shell py-8">
      <h1 className="text-2xl font-black">Categories</h1>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {categories.map((category) => (
          <Link className="panel" key={category._id} to={`/search?category=${category._id}`}>
            <img className="h-32 w-full rounded-lg object-cover" src={category.image} alt={category.name} />
            <p className="mt-3 font-bold">{category.name}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
