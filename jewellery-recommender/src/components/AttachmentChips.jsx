// src/components/AttachmentChips.jsx
import { X } from "lucide-react";

export default function AttachmentChips({ items = [], onRemove }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex gap-2 items-center overflow-x-auto py-1">
      {items.map((p) => (
        <div key={p.id} className="flex items-center bg-white border rounded-full px-3 py-2 shadow-sm mr-2">
          <img src={p.preview} alt={p.name} className="w-10 h-10 object-cover rounded-md mr-3" />
          <div className="text-sm text-gray-800 mr-3 max-w-xs truncate">{p.name}</div>
          <button onClick={() => onRemove(p.id)} className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white text-xs">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
