// src/components/ProductCard.jsx
import { motion } from "framer-motion";

export default function ProductCard({ item, onSelect, imageBase = "" }) {
  // item may include image_url from backend; prefix with imageBase if needed
  const img = item.image_url ? (item.image_url.startsWith("http") ? item.image_url : `${imageBase}${item.image_url}`) : null;

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-50 border rounded-lg p-2 text-center hover:shadow transition">
      <div className="h-28 bg-gray-200 rounded mb-2 overflow-hidden">
        {img ? <img src={img} alt={item.name} className="w-full h-full object-cover" /> : null}
      </div>
      <p className="text-sm font-medium">{item.name}</p>
      <p className="text-xs text-gray-500">{item.desc}</p>
      <button onClick={() => onSelect(item)} className="mt-2 w-full bg-gray-900 text-white text-sm py-1 rounded hover:bg-gray-800">
        Select
      </button>
    </motion.div>
  );
}
