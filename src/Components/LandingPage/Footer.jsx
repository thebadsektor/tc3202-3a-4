// Footer.jsx - Footer component for the Landing Page
import { Icons } from "./Icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 shadow-lg py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-5xl justify-items-center text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start">
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
                href="https://www.facebook.com/deanmartin.mabulay/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#4285F4] transition-colors"
              >
                <Icons.Facebook />
              </a>
              <a
                href="https://www.facebook.com/joyceann.cuala"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#4285F4] transition-colors"
              >
                <Icons.Twitter />
              </a>
              <a
                href="https://www.facebook.com/dondon.esquivel.1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#4285F4] transition-colors"
              >
                <Icons.Instagram />
              </a>
              <a
                href="https://www.facebook.com/leorogel.oca"
                target="_blank"
                rel="noopener noreferrer"
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
                <span className="text-gray-400">AI-Powered Design</span>
              </li>
              <li>
                <span className="text-gray-400">Room Visualization</span>
              </li>
              <li>
                <span className="text-gray-400">Style Recommendations</span>
              </li>
              <li>
                <span className="text-gray-400">Furniture Selection</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy-policy#privacy-policy-top"
                  className="text-gray-400 hover:text-[#4285F4] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service#terms-of-service-top"
                  className="text-gray-400 hover:text-[#4285F4] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy#cookie-policy-top"
                  className="text-gray-400 hover:text-[#4285F4] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Cookie Policy
                </Link>
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
