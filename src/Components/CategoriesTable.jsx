import React, { useState, useEffect } from "react";
import TableHeader from "./shared/Table/TableHeader";
import CategoryTableRow from "./Categories/CategoryTableRow";
import CategoryModal from "./Categories/CategoryModal";
import Modal from "./shared/Modal";
import Toast from "./shared/Toast";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../utils/appwriteService";

const CategoriesTable = ({ initialCategories, onCategoryUpdate }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [filteredCategories, setFilteredCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddCategory = async () => {
    try {
      // Validate required field
      if (!newCategory.trim()) {
        showNotification("Please fill in the Category Name", "error");
        return;
      }

      // Check for duplicate category name
      const duplicateCategory = categories.find(
        (c) =>
          c.name.toLowerCase() === newCategory.toLowerCase() &&
          (!editingCategory || c.id !== editingCategory.id)
      );

      if (duplicateCategory) {
        showNotification("Unable to save. Category already exist!", "error");
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
        showNotification("Category updated successfully");
      } else {
        // Create new category
        const createdCategory = await createCategory(newCategory);
        setCategories([...categories, createdCategory]);
        showNotification("Category added successfully");
      }
      setShowCategoryModal(false);
      setNewCategory("");
      setEditingCategory(null);

      // Notify parent component about the category update
      if (onCategoryUpdate) {
        onCategoryUpdate();
      }
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
      showNotification("Category deleted successfully");

      // Notify parent component about the category update
      if (onCategoryUpdate) {
        onCategoryUpdate();
      }
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

  useEffect(() => {
    let filtered = [...categories];
    if (searchTerm.trim() !== "") {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((category) =>
        category.name.toLowerCase().includes(lowercasedSearch)
      );
    }
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  return (
    <>
      <Toast 
        showToast={showToast} 
        toastMessage={toastMessage} 
        toastType={toastType} 
      />
      <div className="bg-[#232936] rounded-lg">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Categories</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-[#1A1F2A] text-white rounded-lg border-none w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <button
              onClick={() => {
                setEditingCategory(null);
                setNewCategory("");
                setShowCategoryModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-plus"></i>
              <span>Add Category</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[calc(100vh-300px)]" style={{ scrollbarWidth: "thin", scrollbarColor: "#4169E1 #1A1F2A" }}>
          <table className="w-full">
            <TableHeader columns={["name", "edit", "delete"]} />
            <tbody>
              {filteredCategories.map((category) => (
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
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
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
