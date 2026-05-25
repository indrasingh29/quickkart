import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login, register } from "../store/slices/authSlice.js";

export default function Auth({ mode }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useSelector((state) => state.auth.loading);

  const submit = async (event) => {
    event.preventDefault();
    try {
      const action = isLogin ? login({ email: form.email, password: form.password }) : register({ ...form, role: "customer" });
      await dispatch(action).unwrap();
      toast.success(isLogin ? "Welcome back" : "Account created");
      navigate(location.state?.from || "/");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <main className="container-shell grid min-h-[calc(100vh-8rem)] place-items-center py-10">
      <form className="panel w-full max-w-md" onSubmit={submit}>
        <h1 className="text-2xl font-black">{isLogin ? "Login" : "Create account"}</h1>
        <p className="mt-1 text-sm text-slate-500">Use customer@quickkart.dev / password123 after seeding.</p>
        {!isLogin && <input className="input mt-5" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input className="input mt-3" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {!isLogin && <input className="input mt-3" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />}
        <input className="input mt-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary mt-5 w-full" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>
        <Link className="mt-4 block text-center text-sm font-bold text-quick-green" to={isLogin ? "/register" : "/login"}>
          {isLogin ? "New here? Register" : "Already have an account? Login"}
        </Link>
      </form>
    </main>
  );
}
