import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-3xl font-semibold mb-6">Welcome to Mainly Silver Assistant 💎</h1>
      <div className="space-x-4">
        <Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Get Started
        </Link>
        <Link to="/cart" className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
          View Cart
        </Link>
      </div>
    </div>
  );
}
