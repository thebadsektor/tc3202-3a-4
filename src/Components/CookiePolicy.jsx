import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./LandingPage/Footer";
import PolicyHeader from "./shared/PolicyHeader";

const CookiePolicy = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };
  
  return (
    <div className="min-h-screen bg-[#1A1F2A] text-gray-300">
      <PolicyHeader handleLogin={handleLogin} handleSignUp={handleSignUp} />

      {/* Main Content */}
      <main id="cookie-policy-top" className="container mx-auto px-4 py-12 max-w-4xl mt-20">
        <h1 className="text-3xl font-bold text-white mb-8">Cookie Policy</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
            <p className="mb-4">
              This Cookie Policy explains how IntelCor ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our application. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
            <p>
              Please read this Cookie Policy carefully before using our application. By using our application, you are accepting the practices described in this Cookie Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website or use an application. Cookies are widely used by website owners and application providers to make their websites and applications work, or to work more efficiently, as well as to provide reporting information.
            </p>
            <p>
              Cookies set by the website or application owner (in this case, IntelCor) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website or application (such as advertising, interactive content, and analytics).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Cookies</h2>
            <p className="mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium text-white">Authentication</span> - We use cookies to identify you when you visit our application and as you navigate through the application. This helps us to provide you with a personalized experience and prevents you from having to log in every time you visit a new page.
              </li>
              <li>
                <span className="font-medium text-white">Security</span> - We use cookies as an element of the security measures used to protect user accounts, including preventing fraudulent use of login credentials, and to protect our application and services generally.
              </li>
              <li>
                <span className="font-medium text-white">Preferences</span> - We use cookies to store information about your preferences and to personalize the application for you. This includes remembering your design preferences, selected styles, and room configurations.
              </li>
              <li>
                <span className="font-medium text-white">Analytics</span> - We use cookies to help us analyze the use and performance of our application, to improve our services.
              </li>
              <li>
                <span className="font-medium text-white">Session State</span> - We use cookies to maintain the state of your session, such as which room you're designing or which products you've selected.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cookies We Use</h2>
            <p className="mb-4">The specific cookies we use include:</p>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cookie Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">sb-auth-token</td>
                    <td className="px-6 py-4">Authentication token for Supabase</td>
                    <td className="px-6 py-4">Session</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">adminActiveTab</td>
                    <td className="px-6 py-4">Remembers the active tab in admin panel</td>
                    <td className="px-6 py-4">Persistent</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">adminLastSessionTime</td>
                    <td className="px-6 py-4">Tracks admin session creation time</td>
                    <td className="px-6 py-4">Persistent</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">_ga</td>
                    <td className="px-6 py-4">Google Analytics</td>
                    <td className="px-6 py-4">2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the application and deliver advertisements on and through the application. These may include analytics providers (such as Google Analytics) which help us analyze how users use our application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
            <p className="mb-4">
              Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version. You can obtain up-to-date information about blocking and deleting cookies via these links:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">Google Chrome</a>
              </li>
              <li>
                <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">Mozilla Firefox</a>
              </li>
              <li>
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">Microsoft Edge</a>
              </li>
              <li>
                <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">Safari</a>
              </li>
            </ul>
            <p className="mt-4">
              Please note that blocking cookies may have a negative impact on the functionality of our application. Some features of the application may not be available if you disable cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date. You are advised to review this Cookie Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at cookies@intelcor.com.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;