// src/components/UploadFooter.jsx
import { UploadCloud, Send } from "lucide-react";

export default function UploadFooter({ onAttachProps, inputValue, onChangeInput, onSend, onKeyDown }) {
  // onAttachProps -> spread onAttachProps to attach area (getRootProps/getInputProps)
  return (
    <footer className="border-t bg-white p-3 flex items-center gap-2 rounded-lg shadow-sm" onKeyDown={onKeyDown}>
      <div {...onAttachProps.getRootProps()} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-100">
        <input {...onAttachProps.getInputProps()} />
        <UploadCloud className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700">Attach</span>
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => onChangeInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <button onClick={onSend} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
        <Send className="w-4 h-4" />
      </button>
    </footer>
  );
}
