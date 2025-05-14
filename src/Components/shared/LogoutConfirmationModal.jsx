import React from "react";
import Modal from "./Modal";

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const handleLogout = () => {
    // Close modal with animation first
    onClose();
    // Wait for animation to complete before executing logout
    setTimeout(onConfirm, 200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Logout">
      <div className="space-y-4">
        <p className="text-gray-300">Are you sure you want to logout?</p>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmationModal;
