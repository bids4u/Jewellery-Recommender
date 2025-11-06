// src/pages/Upload.jsx
import { useState, useRef, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { useCartStore } from "../store/cartStore";

import { uploadFiles, recommend } from "../api/api";
import ImageDropzone from "../components/ImageDropzone";
import AttachmentChips from "../components/AttachmentChips";
import ChatMessage from "../components/ChatMessage";
import UploadFooter from "../components/UploadFooter";

export default function Upload() {
  const [messages, setMessages] = useState([
    { sender: "bot", type: "text", content: "Hi! Upload jewellery references or describe your client’s style." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // pendingImages: [{ id, file, preview, name }]
  const [pendingImages, setPendingImages] = useState([]);
  const chatEndRef = useRef(null);
  const addItem = useCartStore((s) => s.addItem);

  // scroll
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
  scrollToBottom();
}, [messages]);


  // when files come from dropzone
  const handleFiles = useCallback((files) => {
    const previews = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));
    setPendingImages((prev) => [...prev, ...previews]);
  }, []);

  // dropzone props to forward into UploadFooter
  const dropzone = useDropzone({
    onDrop: (accepted) => handleFiles(accepted),
    accept: { "image/*": [] },
    multiple: true,
    maxFiles: 10,
  });

  // remove pending
  const removePending = (id) => {
    setPendingImages((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) URL.revokeObjectURL(found.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  // simulate bot typing + set product message
  const setBotProducts = (products) => {
    setIsTyping(false);
    setMessages((prev) => [...prev, { sender: "bot", type: "product", content: products }]);
    scrollToBottom();
  };

  // send: if pending images -> upload to backend first to get upload_id -> call recommend
  const handleSend = async () => {
    if (!input.trim() && pendingImages.length === 0) return;

    const userMsgs = [];
    if (pendingImages.length > 0) {
      // push local image message to chat immediately as user-sent
      const imgContent = pendingImages.map((p) => ({ preview: p.preview, name: p.name }));
      userMsgs.push({ sender: "user", type: "image", content: imgContent });
    }
    if (input.trim()) userMsgs.push({ sender: "user", type: "text", content: input.trim() });

    setMessages((prev) => [...prev, ...userMsgs]);
    setInput("");
    scrollToBottom();

    // call backend if we have images (upload -> recommend)
    try {
      setIsTyping(true);
      let uploadId = null;
      if (pendingImages.length > 0) {
        // upload files (use the File objects)
        const files = pendingImages.map((p) => p.file);
        const uploaded = await uploadFiles(files, "", "uploaded from UI");
        uploadId = uploaded.upload_id;
      }

      // call recommend with uploadId and input text (refineText)
      const recRes = await recommend(uploadId || "", input.trim());
      // recRes.recommendations expected array of { id, name, desc, image_url }
      // prefix image urls with BASE if relative, but api.js returns image_url as relative
      // show the bot products:
      setBotProducts(recRes.recommendations);

    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", type: "text", content: "Sorry — something went wrong contacting the server." }]);
    } finally {
      // cleanup pending previews and files
      pendingImages.forEach((p) => URL.revokeObjectURL(p.preview));
      setPendingImages([]);
      scrollToBottom();
    }
  };

  // product select handler (from ChatMessage -> ProductCard)
  const handleSelectProduct = async (item) => {
    try {
      // call API select if you want, but for now just add to cart store and show chat entry
      addItem(item);
      setMessages((prev) => [...prev, { sender: "user", type: "text", content: `Selected: ${item.name}` }]);
      scrollToBottom();
      setIsTyping(true);
      // optional: call backend /select
      // await selectProduct(item.id);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: "bot", type: "text", content: `Got it — added ${item.name}. Want more like this?` }]);
        scrollToBottom();
      }, 800);
    } catch (err) {
      console.error(err);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-gray-50">
      <div className="max-w-3xl mx-auto w-full p-6 flex flex-col h-full">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pb-32">
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-blue-100 text-gray-800" : "bg-white shadow-sm text-gray-700"}`}>
                <ChatMessage msg={msg} onSelectProduct={handleSelectProduct} imageBase={process.env.REACT_APP_API_URL || "http://localhost:8000"} />
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="bg-white text-gray-400 italic px-3 py-2 rounded-lg shadow-sm w-fit">
              Bot is typing...
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Pending attachments above input */}
        <div className="mb-3">
          <AttachmentChips items={pendingImages} onRemove={removePending} />
        </div>

        {/* Input row (pass dropzone props) */}
        <UploadFooter
          onAttachProps={{ getRootProps: dropzone.getRootProps, getInputProps: dropzone.getInputProps }}
          inputValue={input}
          onChangeInput={setInput}
          onSend={handleSend}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
}
