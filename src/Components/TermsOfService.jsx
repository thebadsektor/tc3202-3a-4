import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./LandingPage/Footer";
import PolicyHeader from "./shared/PolicyHeader";

const TermsOfService = () => {
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
      <main id="terms-of-service-top" className="container mx-auto px-4 py-12 max-w-4xl mt-20">
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
            <p className="mb-4">
              Welcome to IntelCor. These Terms of Service ("Terms") govern your access to and use of the IntelCor Smart Room Design Assistant application, including any content, functionality, and services offered on or through our application.
            </p>
            <p>
              Please read these Terms carefully before you start using IntelCor. By using the application, you accept and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use our application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Account Registration</h2>
            <p className="mb-4">
              To access certain features of the application, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="mb-4">
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account, whether or not you have authorized such activities or actions.
            </p>
            <p>
              We reserve the right to disable any user account at any time if, in our opinion, you have failed to comply with any of the provisions of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Services Description</h2>
            <p className="mb-4">
              IntelCor provides an AI-powered room design assistant that helps users visualize and plan their interior spaces. Our services include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI analysis of floor plans to detect room shapes and dimensions</li>
              <li>Style and product recommendations based on user preferences</li>
              <li>Visualization of room designs with selected products</li>
              <li>Product quantity calculations based on room dimensions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">User Content</h2>
            <p className="mb-4">
              Our application allows you to upload, submit, store, send, or receive content such as floor plans and room dimensions. You retain ownership of any intellectual property rights that you hold in that content.
            </p>
            <p className="mb-4">
              When you upload, submit, store, send, or receive content to or through our application, you give IntelCor a worldwide license to use, host, store, reproduce, modify, create derivative works, communicate, publish, publicly perform, publicly display, and distribute such content. The rights you grant in this license are for the limited purpose of operating, promoting, and improving our services.
            </p>
            <p>
              You represent and warrant that you own or have the necessary rights to grant us the license described above for any content that you submit to our application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property</h2>
            <p className="mb-4">
              The application and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by IntelCor, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <p>
              These Terms do not grant you any rights to use the IntelCor trademarks, logos, domain names, or other brand features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Prohibited Uses</h2>
            <p className="mb-4">You agree not to use the application:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter", "spam", or any other similar solicitation</li>
              <li>To impersonate or attempt to impersonate IntelCor, an IntelCor employee, another user, or any other person or entity</li>
              <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the application, or which may harm IntelCor or users of the application or expose them to liability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Disclaimer of Warranties</h2>
            <p className="mb-4">
              Your use of the application is at your sole risk. The application is provided on an "AS IS" and "AS AVAILABLE" basis. IntelCor expressly disclaims all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            <p>
              IntelCor makes no warranty that the application will meet your requirements, be available on an uninterrupted, secure, or error-free basis, or that the results that may be obtained from the use of the application will be accurate or reliable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
            <p>
              In no event shall IntelCor, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
            <p>
              We may revise and update these Terms from time to time in our sole discretion. All changes are effective immediately when we post them. Your continued use of the application following the posting of revised Terms means that you accept and agree to the changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at terms@intelcor.com.
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

export default TermsOfService;