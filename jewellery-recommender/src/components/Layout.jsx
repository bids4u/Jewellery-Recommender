import { Outlet, Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "../store/cartStore";
import CartDrawer from "./CartDrawer";

export default function Layout() {
  const [cartOpen, setCartOpen] = useState(false);
  const { items } = useCartStore();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
        <Link to="/" className="text-lg font-semibold text-gray-800">
          💍 Mainly Silver Assistant
        </Link>
        <nav className="flex gap-6 text-sm text-gray-600">
          <Link to="/upload" className="hover:text-blue-600">Upload</Link>
          <Link to="/recommend" className="hover:text-blue-600">Recommend</Link>
          <button
            onClick={() => setCartOpen(true)}
            className="relative hover:text-blue-600 flex items-center gap-1"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {items.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs px-1.5 rounded-full">
                {items.length}
              </span>
            )}
          </button>
        </nav>
      </header>

      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
