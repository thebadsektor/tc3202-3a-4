import React from "react";

const Navbar = ({
  showNavbar,
  user,
  showProfileMenu,
  setShowProfileMenu,
  handleLogout,
}) => {
  return (
    <nav
      className={`bg-gray-800 shadow-lg fixed top-0 w-full z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } hover:translate-y-0`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img src="/intellcor.png" alt="Company Logo" className="h-15" />
          </div>
          <div className="flex items-center relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center cursor-pointer px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="text-gray-300 mr-2">
                {user?.email || "user@example.com"}
              </span>
              <i className="fas fa-user-circle text-2xl text-gray-300"></i>
            </div>
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-gray-800 ring-opacity-5 z-50">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-100 rounded-md hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      setShowProfileMenu(false);
                    }}
                  >
                    User Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-100 rounded-md hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
