import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 min-h-screen w-full"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-[#232936] p-6 rounded-lg w-[400px]">
        <h2 className="text-white text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
