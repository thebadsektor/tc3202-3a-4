import React from "react";
import Modal from "../shared/Modal";

const StyleModal = ({
  showModal,
  setShowModal,
  editingStyle,
  newStyle,
  setNewStyle,
  handleAddStyle,
}) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        setNewStyle("");
      }}
      title={editingStyle ? "Edit Style" : "Add New Style"}
    >
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Style Name"
          value={newStyle}
          onChange={(e) => setNewStyle(e.target.value)}
          className="w-full px-4 py-2 bg-[#1A1F2A] text-white rounded-lg border-none"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setShowModal(false);
              setNewStyle("");
            }}
            className="px-4 py-2 text-gray-400 hover:text-white !rounded-button cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAddStyle}
            className="px-4 py-2 bg-[#4169E1] text-white !rounded-button cursor-pointer"
          >
            {editingStyle ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StyleModal;
