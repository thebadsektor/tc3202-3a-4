import React, { useState } from "react";
import TableHeader from "./shared/Table/TableHeader";
import CategoryTableRow from "./Categories/CategoryTableRow";
import CategoryModal from "./Categories/CategoryModal";
import Modal from "./shared/Modal";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../utils/appwriteService";

const CategoriesTable = ({ initialCategories }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleAddCategory = async () => {
    try {
      // Validate required field
      if (!newCategory.trim()) {
        alert("Please fill in the Category Name");
        return;
      }

      // Check for duplicate category name
      const duplicateCategory = categories.find(
        (c) =>
          c.name.toLowerCase() === newCategory.toLowerCase() &&
          (!editingCategory || c.id !== editingCategory.id)
      );

      if (duplicateCategory) {
        alert("Unable to save. Category already exist!");
        return;
      }

      if (editingCategory) {
        // Update existing category
        const updatedCategory = await updateCategory(
          editingCategory.id,
          newCategory
        );
        setCategories(
          categories.map((c) =>
            c.id === editingCategory.id ? updatedCategory : c
          )
        );
      } else {
        // Create new category
        const createdCategory = await createCategory(newCategory);
        setCategories([...categories, createdCategory]);
      }
      setShowCategoryModal(false);
      setNewCategory("");
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
      // You could add error handling UI here if needed
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(categoryToDelete.id);
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      // You could add error handling UI here if needed
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setNewCategory(category.name);
    setShowCategoryModal(true);
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
            <TableHeader columns={["name", "edit", "delete"]} />
            <tbody>
              {categories.map((category) => (
                <CategoryTableRow
                  key={category.id}
                  category={category}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal
        showModal={showCategoryModal}
        setShowModal={setShowCategoryModal}
        editingCategory={editingCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleAddCategory={handleAddCategory}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Confirm Delete"
        >
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
        </Modal>
      )}
    </>
  );
};

export default CategoriesTable;
