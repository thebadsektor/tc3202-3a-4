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
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const validateForm = () => {
    if (!newUser.email) {
      setErrorMsg("Please enter an email address");
      return false;
    }

    if (!editingUser && !newUser.password) {
      setErrorMsg("Please enter a password");
      return false;
    }

    if (!editingUser && newUser.password) {
      if (
        newUser.password.length < 8 ||
        !/[A-Z]/.test(newUser.password) ||
        !/[a-z]/.test(newUser.password) ||
        !/[0-9]/.test(newUser.password)
      ) {
        setErrorMsg(
          "Password must have at least 8 characters, an uppercase letter, a lowercase letter, and a number"
        );
        return false;
      }
    }

    if (!newUser.role) {
      setErrorMsg("Please select a role");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleAddUser();
    }
  };
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

        {!editingUser && (
          <div>
            <label className="block text-gray-400 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newUser.password || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#1A1F2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
          </div>
        )}

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

        {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}

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
            onClick={handleSubmit}
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
