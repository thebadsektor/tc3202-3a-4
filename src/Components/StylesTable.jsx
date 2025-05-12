import React, { useState, useEffect } from "react";
import TableHeader from "./shared/Table/TableHeader";
import StyleTableRow from "./Styles/StyleTableRow";
import StyleModal from "./Styles/StyleModal";
import Modal from "./shared/Modal";
import Toast from "./shared/Toast";
import {
  createStyle,
  updateStyle,
  deleteStyle,
} from "../utils/appwriteService";

const StylesTable = ({ initialStyles, onStyleUpdate }) => {
  const [styles, setStyles] = useState(initialStyles);
  const [filteredStyles, setFilteredStyles] = useState(initialStyles);
  const [searchTerm, setSearchTerm] = useState("");
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  const [newStyle, setNewStyle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [styleToDelete, setStyleToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddStyle = async () => {
    try {
      // Validate required field
      if (!newStyle.trim()) {
        showNotification("Please fill in the Style Name", "error");
        return;
      }

      // Check for duplicate style name
      const duplicateStyle = styles.find(
        (s) =>
          s.name.toLowerCase() === newStyle.toLowerCase() &&
          (!editingStyle || s.id !== editingStyle.id)
      );

      if (duplicateStyle) {
        showNotification("Unable to save. Style already exist!", "error");
        return;
      }

      if (editingStyle) {
        // Update existing style
        const updatedStyle = await updateStyle(editingStyle.id, newStyle);
        setStyles(
          styles.map((s) => (s.id === editingStyle.id ? updatedStyle : s))
        );
        showNotification("Style updated successfully");
      } else {
        // Create new style
        const createdStyle = await createStyle(newStyle);
        setStyles([...styles, createdStyle]);
        showNotification("Style added successfully");
      }
      setShowStyleModal(false);
      setNewStyle("");
      setEditingStyle(null);

      // Notify parent component about the style update
      if (onStyleUpdate) {
        onStyleUpdate();
      }
    } catch (error) {
      console.error("Error saving style:", error);
      // You could add error handling UI here if needed
    }
  };

  const handleDeleteClick = (style) => {
    setStyleToDelete(style);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteStyle(styleToDelete.id);
      setStyles(styles.filter((s) => s.id !== styleToDelete.id));
      setShowDeleteConfirm(false);
      setStyleToDelete(null);
      showNotification("Style deleted successfully");

      // Notify parent component about the style update
      if (onStyleUpdate) {
        onStyleUpdate();
      }
    } catch (error) {
      console.error("Error deleting style:", error);
      // You could add error handling UI here if needed
    }
  };

  const handleEditClick = (style) => {
    setEditingStyle(style);
    setNewStyle(style.name);
    setShowStyleModal(true);
  };

  useEffect(() => {
    let filtered = [...styles];
    if (searchTerm.trim() !== "") {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((style) =>
        style.name.toLowerCase().includes(lowercasedSearch)
      );
    }
    setFilteredStyles(filtered);
  }, [searchTerm, styles]);

  return (
    <>
      <Toast 
        showToast={showToast} 
        toastMessage={toastMessage} 
        toastType={toastType} 
      />
      <div className="bg-[#232936] rounded-lg">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Styles</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search styles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-[#1A1F2A] text-white rounded-lg border-none w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <button
              onClick={() => {
                setEditingStyle(null);
                setNewStyle("");
                setShowStyleModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-plus"></i>
              <span>Add Style</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[calc(100vh-300px)]" style={{ scrollbarWidth: "thin", scrollbarColor: "#4169E1 #1A1F2A" }}>
          <table className="w-full">
            <TableHeader columns={["name", "edit", "delete"]} />
            <tbody>
              {filteredStyles.map((style) => (
                <StyleTableRow
                  key={style.id}
                  style={style}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StyleModal
        showModal={showStyleModal}
        setShowModal={setShowStyleModal}
        editingStyle={editingStyle}
        newStyle={newStyle}
        setNewStyle={setNewStyle}
        handleAddStyle={handleAddStyle}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Confirm Delete"
        >
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete the style "{styleToDelete?.name}"?
            This action cannot be undone.
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

export default StylesTable;
