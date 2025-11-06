// src/components/ChatMessage.jsx
import ProductCard from "./ProductCard";

export default function ChatMessage({ msg, onSelectProduct, imageBase }) {
  const sideClass = msg.sender === "user" ? "justify-end" : "justify-start";
  const bubbleClass = msg.sender === "user" ? "bg-blue-100 text-gray-800" : "bg-white shadow-sm text-gray-700";

  return (
    <div className={`flex ${sideClass}`}>
      <div className={`p-3 rounded-lg max-w-[80%] ${bubbleClass}`}>
        {msg.type === "text" && <p>{msg.content}</p>}
        {msg.type === "image" && (
          <div className="flex gap-2 flex-wrap">
            {msg.content.map((f, idx) => (
              <img key={idx} src={f.preview} alt={f.name} className="w-24 h-24 object-cover rounded-lg shadow-sm" />
            ))}
          </div>
        )}
        {msg.type === "product" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
            {msg.content.map((item, idx) => (
              <ProductCard key={idx} item={item} imageBase={imageBase} onSelect={onSelectProduct} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
