import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function CartDrawer({ open, onOpenChange }) {
  const { items, removeItem, clearCart } = useCartStore();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

        <Dialog.Content asChild>
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed top-0 right-0 w-full sm:w-[380px] h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <Dialog.Title className="text-lg font-semibold">
                Your Selection 🛒
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 rounded hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </Dialog.Close>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                  No items yet — select jewellery to add!
                </p>
              ) : (
                items.map((item, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.name)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-2">
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </button>
              </div>
            )}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
