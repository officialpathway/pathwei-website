"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  trackClick: (price: number) => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, price, trackClick }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 via-purple-950 to-violet-900 rounded-2xl p-1 shadow-2xl max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-900/80 rounded-xl p-6 relative overflow-hidden">
                {/* ... (keep your existing modal content) ... */}
                
                <div className="relative z-10 text-center mt-4">
                  {/* Price Display */}
                  <div className="mb-6">
                    <p className="text-gray-300 mb-2">Precio especial:</p>
                    <p className="text-4xl font-bold text-amber-400">
                      ${price.toFixed(2)}
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      trackClick(price);
                      onClose();
                    }}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    Aún no disponible
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;