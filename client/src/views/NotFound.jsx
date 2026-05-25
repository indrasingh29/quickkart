import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="screen-center px-4 text-center">
      <div>
        <h1 className="text-4xl font-black">Page not found</h1>
        <Link className="btn-primary mt-5" to="/">Go home</Link>
      </div>
    </main>
  );
}
