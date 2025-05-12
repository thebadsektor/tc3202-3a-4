import React, { useEffect } from "react";

const Toast = ({ showToast, toastMessage, toastType = "success", duration, onDismiss }) => {
  if (!showToast) return null;

  // Auto-dismiss toast after specified duration
  useEffect(() => {
    if (showToast && duration) {
      const timer = setTimeout(() => {
        if (onDismiss) onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [showToast, duration, onDismiss]);

  const getBackgroundColor = () => {
    switch (toastType) {
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      case "success":
      default:
        return "bg-green-500";
    }
  };

  return (
    <div
      className={`fixed top-16 left-1/2 transform -translate-x-1/2 ${getBackgroundColor()} text-white px-6 py-3 rounded-lg shadow-lg z-50`}
    >
      {toastMessage}
    </div>
  );
};

export default Toast;