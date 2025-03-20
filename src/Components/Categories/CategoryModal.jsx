import React from "react";
import Modal from "../shared/Modal";

const CategoryModal = ({
  showModal,
  setShowModal,
  editingCategory,
  newCategory,
  setNewCategory,
  handleAddCategory,
}) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        setNewCategory("");
      }}
      title={editingCategory ? "Edit Category" : "Add New Category"}
    >
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full px-4 py-2 bg-[#1A1F2A] text-white rounded-lg border-none"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setShowModal(false);
              setNewCategory("");
            }}
            className="px-4 py-2 text-gray-400 hover:text-white !rounded-button cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-[#4169E1] text-white !rounded-button cursor-pointer"
          >
            {editingCategory ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryModal;
