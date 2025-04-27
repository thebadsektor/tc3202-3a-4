// Header.jsx - Header component for the Landing Page
import { useState } from "react";
import { Icons } from "./Icons";

const Header = ({ handleLogin, handleSignUp }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="py-2.5 bg-gray-800 shadow-lg fixed top-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="mr-2">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 4L4 9V23L10.5 28L26 28L26 4L10.5 4Z"
                    stroke="#4285F4"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path d="M17 16L21 16" stroke="#4285F4" strokeWidth="2" />
                  <circle cx="14" cy="16" r="2" fill="#4285F4" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#4285F4] to-[#4285F4] bg-clip-text text-transparent">
                IntelCor
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="#styles"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Styles
            </a>
            <a
              href="#about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </a>
            <div className="flex space-x-4">
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
                className="py-2 px-4 rounded-md font-medium bg-[#3B82F6] hover:bg-[#2563EB] text-white transition-all flex items-center cursor-pointer"
              >
                <span className="mr-2">
                  <Icons.UserPlus />
                </span>{" "}
                Sign Up
              </button>
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
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#styles"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Design Styles
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </a>
              <div className="flex flex-col space-y-3 pt-3">
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
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
