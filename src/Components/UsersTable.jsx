import React, { useState, useEffect } from "react";
import TableHeader from "./shared/Table/TableHeader";
import UsersTableRow from "./Users/UsersTableRow";
import UserModal from "./Users/UserModal";
import Modal from "./shared/Modal";
import SkeletonLoading from "./shared/SkeletonLoading";
import { supabase } from "../utils/supabaseClient";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Get users from Supabase using the public profiles table instead of admin API
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role");

      if (error) throw error;

      if (data && data.length > 0) {
        setUsers(data);
        setFilteredUsers(data);
        setError(null);
      } else {
        // If no profiles found, try to get the current user at least
        const { data: authData } = await supabase.auth.getUser();

        if (authData && authData.user) {
          const currentUser = {
            id: authData.user.id,
            email: authData.user.email,
            role: authData.user.user_metadata?.role || "user",
          };
          setUsers([currentUser]);
          setFilteredUsers([currentUser]);
          setError(null);
        } else {
          throw new Error("No users found");
        }
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
      // Use fallback data if fetch fails
      const fallbackUsers = [
        { id: "1", email: "admin@example.com", role: "admin" },
        { id: "2", email: "user@example.com", role: "user" },
      ];
      setUsers(fallbackUsers);
      setFilteredUsers(fallbackUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      // Validate required fields
      if (!newUser.email || !newUser.role) {
        alert("Please fill in all required fields");
        return;
      }

      // Check for duplicate email
      const duplicateUser = users.find(
        (u) =>
          u.email.toLowerCase() === newUser.email.toLowerCase() &&
          (!editingUser || u.id !== editingUser.id)
      );

      if (duplicateUser) {
        alert("Unable to save User. Email already exists!");
        return;
      }

      let savedUser;
      if (editingUser) {
        // Update existing user in profiles table
        const { data, error } = await supabase
          .from("profiles")
          .update({
            email: newUser.email,
            role: newUser.role,
          })
          .eq("id", editingUser.id)
          .select();

        if (error) throw error;
        savedUser = data[0] || {
          id: editingUser.id,
          email: newUser.email,
          role: newUser.role,
        };
      } else {
        // Generate a random password for the user
        const randomPassword =
          Math.random().toString(36).slice(-10) +
          Math.random().toString(36).toUpperCase().slice(-2) +
          Math.random().toString(21).slice(-2);

        // First create auth user with the random password
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: newUser.email,
            password: randomPassword,
          }
        );

        if (authError) throw authError;

        if (authData && authData.user) {
          // Then create profile entry
          const { data, error } = await supabase
            .from("profiles")
            .insert([
              {
                id: authData.user.id,
                email: newUser.email,
                role: newUser.role,
              },
            ])
            .select();

          if (error) throw error;

          savedUser = data[0] || {
            id: authData.user.id,
            email: newUser.email,
            role: newUser.role,
          };
        } else {
          throw new Error("Failed to create user");
        }
      }

      if (savedUser) {
        if (editingUser) {
          setUsers(users.map((u) => (u.id === editingUser.id ? savedUser : u)));
        } else {
          setUsers([...users, savedUser]);
        }
        setShowUserModal(false);
        setNewUser({});
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user. Please check all fields and try again.");
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      // Delete from profiles table first
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userToDelete.id);

      if (profileError) throw profileError;

      // Note: We can't delete from auth without admin privileges,
      // so we'll just remove from our profiles table

      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setNewUser({
      email: user.email,
      role: user.role,
    });
    setShowUserModal(true);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(term.toLowerCase()) ||
          user.role.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  if (loading) {
    return <SkeletonLoading type="users" />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] p-6 rounded-xl">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-white text-xl font-semibold">User Management</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-4 py-2 bg-[#1A1F2A] text-white rounded-lg border-none w-64 focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              setNewUser({});
              setShowUserModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <i className="fas fa-plus"></i>
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          className="max-h-[calc(8*56px)] overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4169E1 #1A1F2A",
          }}
        >
          <table className="w-full">
            <TableHeader columns={["Email", "Role", "Edit", "Delete"]} />
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <UsersTableRow
                    key={user.id}
                    user={user}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        showModal={showUserModal}
        setShowModal={setShowUserModal}
        editingUser={editingUser}
        newUser={newUser}
        setNewUser={setNewUser}
        handleAddUser={handleAddUser}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-white">
            Are you sure you want to delete the user{" "}
            <span className="font-semibold">{userToDelete?.email}</span>?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersTable;
