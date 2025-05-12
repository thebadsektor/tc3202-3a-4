// PolicyHeader.jsx - Modified Header component for Policy pages
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icons } from "../LandingPage/Icons";
import { supabase } from "../../utils/supabaseClient";

const PolicyHeader = ({ handleLogin, handleSignUp }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        setIsLoggedIn(!!sessionData.session);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <header className="py-1 bg-gray-800 shadow-lg fixed top-0 w-full z-50 transition-transform duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="mr-2">
                <img
                  src="/intellcor.png"
                  alt="IntelCor Logo"
                  className="h-15 cursor-pointer"
                  onClick={() => window.location.reload()}
                />
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/#styles"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Styles
            </Link>
            <Link
              to="/#about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <div className="flex space-x-4">
              {isLoggedIn ? (
                <button
                  onClick={async () => {
                    try {
                      // Get user data to check role
                      const { data: userData } = await supabase.auth.getUser();
                      const userRole =
                        userData.user?.user_metadata?.role || "user";

                      // Navigate based on role
                      window.location.href =
                        userRole === "admin" ? "/admin" : "/user";
                    } catch (error) {
                      console.error("Error checking user role:", error);
                      window.location.href = "/user"; // Fallback to user page
                    }
                  }}
                  className="py-2 px-4 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center cursor-pointer"
                >
                  Continue to account
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    <Icons.ArrowRight />
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="py-2 px-4 rounded-md font-medium text-white transition-all flex items-center hover:text-[#3B82F6] cursor-pointer"
                  >
                    <span className="mr-2">
                      <Icons.LogIn />
                    </span>{" "}
                    Login
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="py-2 px-4 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center cursor-pointer"
                  >
                    <span className="mr-2">
                      <Icons.UserPlus />
                    </span>{" "}
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 focus:outline-none"
            >
              {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <nav className="flex flex-col space-y-4 py-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/#styles"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Design Styles
              </Link>
              <Link
                to="/#about"
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </Link>
              <div className="flex flex-col space-y-3 pt-3">
                {isLoggedIn ? (
                  <button
                    onClick={async () => {
                      try {
                        // Get user data to check role
                        const { data: userData } =
                          await supabase.auth.getUser();
                        const userRole =
                          userData.user?.user_metadata?.role || "user";

                        // Navigate based on role
                        window.location.href =
                          userRole === "admin" ? "/admin" : "/user";
                      } catch (error) {
                        console.error("Error checking user role:", error);
                        window.location.href = "/user"; // Fallback to user page
                      }
                    }}
                    className="w-full py-2 px-4 rounded-md font-medium bg-[#3B82F6] hover:bg-[#2563EB] text-white transition-all flex items-center justify-center"
                  >
                    <span className="mr-2">
                      <Icons.UserPlus />
                    </span>{" "}
                    Continue to account
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className="w-full py-2 px-4 rounded-md font-medium text-white transition-all flex items-center justify-center hover:text-[#3B82F6]"
                    >
                      <span className="mr-2">
                        <Icons.LogIn />
                      </span>{" "}
                      Login
                    </button>
                    <button
                      onClick={handleSignUp}
                      className="w-full py-2 px-4 rounded-md font-medium bg-[#3B82F6] hover:bg-[#2563EB] text-white transition-all flex items-center justify-center"
                    >
                      <span className="mr-2">
                        <Icons.UserPlus />
                      </span>{" "}
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default PolicyHeader;
