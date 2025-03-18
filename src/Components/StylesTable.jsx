import React, { useState } from "react";

const StylesTable = ({ initialStyles }) => {
  const [styles, setStyles] = useState(initialStyles);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  const [newStyle, setNewStyle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [styleToDelete, setStyleToDelete] = useState(null);

  const handleAddStyle = () => {
    if (editingStyle) {
      setStyles(
        styles.map((s) =>
          s.id === editingStyle.id ? { ...editingStyle, name: newStyle } : s
        )
      );
    } else {
      setStyles([...styles, { id: styles.length + 1, name: newStyle }]);
    }
    setShowStyleModal(false);
    setNewStyle("");
    setEditingStyle(null);
  };

  const handleDeleteClick = (style) => {
    setStyleToDelete(style);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setStyles(styles.filter((s) => s.id !== styleToDelete.id));
    setShowDeleteConfirm(false);
    setStyleToDelete(null);
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
            <thead>
              <tr className="text-gray-400 text-left">
                <th className="px-6 py-3">NAME</th>
                <th className="px-6 py-3">EDIT</th>
                <th className="px-6 py-3">DELETE</th>
              </tr>
            </thead>
            <tbody>
              {styles.map((style) => (
                <tr key={style.id} className="border-t border-[#374151]">
                  <td className="px-6 py-4 text-white">{style.name}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setEditingStyle(style);
                        setNewStyle(style.name);
                        setShowStyleModal(true);
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
                      onClick={() => handleDeleteClick(style)}
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

      {/* Style Modal */}
      {showStyleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#232936] p-6 rounded-lg w-[400px]">
            <h2 className="text-white text-xl font-semibold mb-4">
              {editingStyle ? "Edit Style" : "Add New Style"}
            </h2>
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
                    setShowStyleModal(false);
                    setNewStyle("");
                    setEditingStyle(null);
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
          </div>
        </div>
      )}
    </>
  );
};

export default StylesTable;
