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
          className="w-full px-4 py-2 bg-[#1A1F2A] text-white rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setShowModal(false);
              setNewCategory("");
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            {editingCategory ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryModal;
