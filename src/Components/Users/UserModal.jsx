import React, { useState } from "react";
import Modal from "../shared/Modal";

const UserModal = ({
  showModal,
  setShowModal,
  editingUser,
  newUser,
  setNewUser,
  handleAddUser,
}) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        setNewUser({});
      }}
      title={editingUser ? "Edit User" : "Add New User"}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-2">Email</label>
          <input
            type="email"
            value={newUser.email || ""}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1F2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Role</label>
          <select
            value={newUser.role || ""}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1F2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setShowModal(false);
              setNewUser({});
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {editingUser ? "Update User" : "Add User"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserModal;
