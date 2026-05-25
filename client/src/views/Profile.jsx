import { useSelector } from "react-redux";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  return (
    <main className="container-shell py-8">
      <section className="panel max-w-2xl">
        <h1 className="text-2xl font-black">Profile</h1>
        <p className="mt-4 font-bold">{user?.name}</p>
        <p className="text-slate-500">{user?.email}</p>
        <p className="text-slate-500">{user?.phone}</p>
      </section>
    </main>
  );
}
