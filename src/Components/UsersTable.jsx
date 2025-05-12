import React, { useState, useEffect } from "react";
import TableHeader from "./shared/Table/TableHeader";
import UsersTableRow from "./Users/UsersTableRow";
import UserModal from "./Users/UserModal";
import Modal from "./shared/Modal";
import SkeletonLoading from "./shared/SkeletonLoading";
import { supabase } from "../utils/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";

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

    // Subscribe to real-time changes
    const channel = supabase
      .channel("profiles_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          console.log("Real-time update:", payload);
          switch (payload.eventType) {
            case "INSERT":
              setUsers((prev) => [...prev, payload.new]);
              setFilteredUsers((prev) => [...prev, payload.new]);
              break;
            case "UPDATE":
              setUsers((prev) =>
                prev.map((user) =>
                  user.id === payload.new.id ? payload.new : user
                )
              );
              setFilteredUsers((prev) =>
                prev.map((user) =>
                  user.id === payload.new.id ? payload.new : user
                )
              );
              break;
            case "DELETE":
              setUsers((prev) =>
                prev.filter((user) => user.id !== payload.old.id)
              );
              setFilteredUsers((prev) =>
                prev.filter((user) => user.id !== payload.old.id)
              );
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      channel.unsubscribe();
    };
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
      // Check for duplicate email
      const duplicateUser = users.find(
        (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
      );

      if (duplicateUser) {
        // If editing user or the duplicate user has a different role, update the role
        if (editingUser || duplicateUser.role !== newUser.role) {
          const { data, error } = await supabase
            .from("profiles")
            .update({ role: newUser.role })
            .eq("id", duplicateUser.id)
            .select();

          if (error) throw error;

          setUsers(users.map((u) => (u.id === duplicateUser.id ? data[0] : u)));
          setShowUserModal(false);
          setNewUser({});
          setEditingUser(null);
          return;
        } else {
          alert("Unable to save User. Email already exists!");
          return;
        }
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
        // Use the password provided in the form
        // First create auth user with the provided password
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: newUser.email,
            password: newUser.password,
            options: {
              data: {
                role: newUser.role, // Store role in user metadata
              },
            },
          }
        );

        if (authError) {
          if (authError.message.includes("User already registered")) {
            throw new Error("This email is already registered");
          }
          throw authError;
        }

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

          if (error) {
            // If profile creation fails, we should still consider this a success
            // as the auth user was created and confirmation email sent
            console.warn("Profile creation error:", error);
          }

          savedUser = data?.[0] || {
            id: authData.user.id,
            email: newUser.email,
            role: newUser.role,
          };

          // Show success message about confirmation email
          alert(
            "User created successfully! Please check email for confirmation link."
          );
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
      // First check if current user is admin
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", (await supabase.auth.getUser()).data.user.id)
        .single();

      if (!currentProfile || currentProfile.role !== "admin") {
        throw new Error("Only admin users can delete users");
      }

      // Delete the auth user using RPC function
      const { error: authError } = await supabase.rpc("delete_user", {
        user_id: userToDelete.id,
      });

      if (authError) {
        console.error("Auth deletion error:", authError);
        throw authError;
      }

      // Update local state after successful deletion
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setFilteredUsers(filteredUsers.filter((u) => u.id !== userToDelete.id));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.message || "Failed to delete user. Please try again.");
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
        <h2 className="text-white text-xl font-semibold">Users</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-4 py-2 bg-[#1A1F2A] text-white rounded-lg border-none w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
            <TableHeader columns={["Email", "Role", "Delete"]} />
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
                    <td colSpan="6" className="py-8">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <img
                          src="/no-results.png"
                          alt="No Results"
                          className="w-15 h-15 text-red-400"
                        />
                        <p className="text-lg font-bold mb-2">No Users Found</p>
                        <p>Please try again with different keywords.</p>
                      </div>
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
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
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
