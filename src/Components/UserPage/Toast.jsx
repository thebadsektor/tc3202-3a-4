import React from "react";

const Toast = ({ showToast, toastMessage, getToastBackgroundColor }) => {
  if (!showToast) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${getToastBackgroundColor(
        toastMessage
      )} text-white px-6 py-3 rounded-lg shadow-lg z-50`}
    >
      {toastMessage}
    </div>
  );
};

export default Toast;
