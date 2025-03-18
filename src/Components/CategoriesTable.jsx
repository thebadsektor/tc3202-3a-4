import React, { useState } from "react";

const CategoriesTable = ({ initialCategories }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleAddCategory = () => {
    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...editingCategory, name: newCategory }
            : c
        )
      );
    } else {
      setCategories([
        ...categories,
        { id: categories.length + 1, name: newCategory },
      ]);
    }
    setShowCategoryModal(false);
    setNewCategory("");
    setEditingCategory(null);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  return (
    <>
      <div className="bg-[#232936] rounded-lg">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Categories</h2>
          <button
            onClick={() => {
              setEditingCategory(null);
              setNewCategory("");
              setShowCategoryModal(true);
            }}
            className="px-4 py-2 bg-[#4169E1] text-white !rounded-button flex items-center gap-2 cursor-pointer"
          >
            <i className="fas fa-plus"></i>
            <span>Add Category</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-left">
                <th className="px-6 py-3">NAME</th>
                <th className="px-6 py-3">EDIT</th>
                <th className="px-6 py-3">DELETE</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t border-[#374151]">
                  <td className="px-6 py-4 text-white">{category.name}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setNewCategory(category.name);
                        setShowCategoryModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-600 p-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#232936] p-6 rounded-lg w-[400px]">
            <h2 className="text-white text-xl font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
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
                    setShowCategoryModal(false);
                    setNewCategory("");
                    setEditingCategory(null);
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
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#232936] p-6 rounded-lg w-[400px]">
            <h2 className="text-white text-xl font-semibold mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the category "
              {categoryToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white !rounded-button cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white !rounded-button cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoriesTable;
