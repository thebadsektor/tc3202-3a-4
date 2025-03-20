import React, { useState } from "react";
import TableHeader from "./shared/Table/TableHeader";
import StyleTableRow from "./Styles/StyleTableRow";
import StyleModal from "./Styles/StyleModal";
import Modal from "./shared/Modal";
import {
  createStyle,
  updateStyle,
  deleteStyle,
} from "../utils/appwriteService";

const StylesTable = ({ initialStyles }) => {
  const [styles, setStyles] = useState(initialStyles);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  const [newStyle, setNewStyle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [styleToDelete, setStyleToDelete] = useState(null);

  const handleAddStyle = async () => {
    try {
      if (editingStyle) {
        // Update existing style
        const updatedStyle = await updateStyle(editingStyle.id, newStyle);
        setStyles(
          styles.map((s) => (s.id === editingStyle.id ? updatedStyle : s))
        );
      } else {
        // Create new style
        const createdStyle = await createStyle(newStyle);
        setStyles([...styles, createdStyle]);
      }
      setShowStyleModal(false);
      setNewStyle("");
      setEditingStyle(null);
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

  return (
    <>
      <div className="bg-[#232936] rounded-lg">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Styles</h2>
          <button
            onClick={() => {
              setEditingStyle(null);
              setNewStyle("");
              setShowStyleModal(true);
            }}
            className="px-4 py-2 bg-[#4169E1] text-white !rounded-button flex items-center gap-2 cursor-pointer"
          >
            <i className="fas fa-plus"></i>
            <span>Add Style</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader columns={["name", "edit", "delete"]} />
            <tbody>
              {styles.map((style) => (
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

export default StylesTable;
