import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import DashboardTab from "./DashboardTab";
import ProductsTab from "./ProductsTab";
import UsersTab from "./UsersTab";
import LogoutConfirmationModal from "./shared/LogoutConfirmationModal";

const AdminPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Track if this is a new login session
  const [isNewSession, setIsNewSession] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
    // Get saved tab from localStorage or default to dashboard
    return localStorage.getItem("adminActiveTab") || "dashboard";
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in and is an admin
    const checkAdminAuth = async () => {
      try {
        setLoading(true);
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          // No active session, redirect to login
          navigate("/");
          return;
        }

        // Get user data to check role
        const { data: userData } = await supabase.auth.getUser();
        const userRole = userData?.user?.user_metadata?.role;

        if (userRole !== "admin") {
          // User is not an admin, redirect to user page
          alert("You don't have permission to access the admin area");
          navigate("/user");
          return;
        }

        setUser(userData.user);

        // Check if this is a new login session by comparing session creation time
        const sessionCreationTime = new Date(
          sessionData.session.created_at
        ).getTime();
        const lastKnownSessionTime = localStorage.getItem(
          "adminLastSessionTime"
        );

        if (
          !lastKnownSessionTime ||
          sessionCreationTime > parseInt(lastKnownSessionTime)
        ) {
          // This is a new session (user just logged in)
          localStorage.setItem("adminLastSessionTime", sessionCreationTime);

          // Set active tab to dashboard for new login sessions
          setActiveTab("dashboard");
          setIsNewSession(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [navigate]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Update localStorage when activeTab changes
  useEffect(() => {
    // Only update localStorage if we're not in a new session
    // This ensures we don't override the dashboard tab selection for new logins
    if (!isNewSession) {
      localStorage.setItem("adminActiveTab", activeTab);
    }
  }, [activeTab, isNewSession]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      // Clear the session timestamp when logging out
      localStorage.removeItem("adminLastSessionTime");
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setShowLogoutModal(false);
    }
  };

  // Render the active tab component
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "products":
        return <ProductsTab />;
      case "users":
        return <UsersTab />;
      default:
        return <DashboardTab />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
          <p className="text-xl">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100">
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
      <div className="flex">
        <aside
          className={`${
            isCollapsed ? "w-20" : "w-60"
          } transition-all duration-300 bg-[#1E293B] min-h-screen py-4 pr-4 pl-1 fixed`}
        >
          <div
            className="flex items-center mb-8 cursor-pointer pl-1"
            onClick={toggleSidebar}
          >
            <img
              src="/intellcor.png"
              alt="Logo"
              className="w-15 h-15"
              style={{ minWidth: "60px", minHeight: "60px" }}
            />
            <span
              className={`ml-3 text-lg font-semibold ${
                isCollapsed ? "hidden" : "block"
              }`}
            >
              Admin Panel
            </span>
          </div>
          <nav className="flex flex-col h-[calc(100vh-80px)] justify-between">
            <div className="space-y-2">
              <button
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "space-x-3"
                } w-full px-4 py-3 rounded-lg cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-[#2D3B4F]"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <i className="fas fa-home"></i>
                <span className={`${isCollapsed ? "hidden" : "block"}`}>
                  Dashboard
                </span>
              </button>
              <button
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "space-x-3"
                } w-full px-4 py-3 rounded-lg cursor-pointer ${
                  activeTab === "products"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-[#2D3B4F]"
                }`}
                onClick={() => setActiveTab("products")}
              >
                <i className="fas fa-box"></i>
                <span className={`${isCollapsed ? "hidden" : "block"}`}>
                  Products
                </span>
              </button>
              <button
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "space-x-3"
                } w-full px-4 py-3 rounded-lg cursor-pointer ${
                  activeTab === "users"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-[#2D3B4F]"
                }`}
                onClick={() => setActiveTab("users")}
              >
                <i className="fas fa-users"></i>
                <span className={`${isCollapsed ? "hidden" : "block"}`}>
                  Users
                </span>
              </button>
            </div>
            <div className="mb-8">
              <button
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "space-x-3"
                } w-full px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-200 cursor-pointer`}
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className={`${isCollapsed ? "hidden" : "block"}`}>
                  Logout
                </span>
              </button>
            </div>
          </nav>
        </aside>
        <main
          className={`flex-1 p-8 ${
            isCollapsed ? "ml-20" : "ml-60"
          } transition-all duration-300`}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <button className="lg:hidden text-2xl text-gray-400 hover:text-white mr-4">
                <i className="fas fa-bars"></i>
              </button>
              <img
                src="https://public.readdy.ai/ai/img_res/d0fd0afc130dee20bcc9aa15b980e500.jpg"
                alt="Store"
                className="w-8 h-8 rounded-lg"
              />
              <h1 className="text-2xl font-semibold">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span>{user?.email || "Admin User"}</span>
              </div>
            </div>
          </div>

          {/* Render the active tab content */}
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
