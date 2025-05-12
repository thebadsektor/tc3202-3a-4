import React, { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setShouldRender(true);
    } else if (!isClosing) {
      setShouldRender(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 min-h-screen w-full transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={handleClose}
    >
      <div 
        className={`bg-[#232936] p-6 rounded-lg w-[400px] transition-all duration-200 ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">{title}</h2>
          <button 
            onClick={handleClose} 
            className="text-white hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;