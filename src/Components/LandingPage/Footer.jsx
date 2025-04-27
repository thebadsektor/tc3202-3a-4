// Footer.jsx - Footer component for the Landing Page
import { Icons } from "./Icons";

const Footer = () => {
  return (
    <footer className="bg-gray-800 shadow-lg py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-5xl justify-items-center text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start">
              <div className="mr-2">
                <svg
                  width="28"
                  height="28"
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
            <p className="text-gray-400 text-sm text-center md:text-left">
              Smart Room Design Assistant - creating
              <br />
              perfect spaces through AI technology.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a
                href="#"
                className="text-gray-400 hover:text-[#4285F4] transition-colors"
              >
                <Icons.Facebook />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#4285F4] transition-colors"
              >
                <Icons.Twitter />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#4285F4] transition-colors"
              >
                <Icons.Instagram />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#4285F4] transition-colors"
              >
                <Icons.Linkedin />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <h className="text-gray-400">AI-Powered Design</h>
              </li>
              <li>
                <h className="text-gray-400">Room Visualization</h>
              </li>
              <li>
                <h className="text-gray-400">Style Recommendations</h>
              </li>
              <li>
                <h className="text-gray-400">Furniture Selection</h>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4285F4] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4285F4] transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4285F4] transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} IntelCor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
