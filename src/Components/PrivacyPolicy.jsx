import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./LandingPage/Footer";
import PolicyHeader from "./shared/PolicyHeader";

const PrivacyPolicy = () => {
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
      <main id="privacy-policy-top" className="container mx-auto px-4 py-12 max-w-4xl mt-20">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
            <p className="mb-4">
              At IntelCor, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Smart Room Design Assistant service.
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
            <p className="mb-4">We collect information that you provide directly to us when you:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Register for an account</li>
              <li>Upload floor plans and room dimensions</li>
              <li>Select design preferences (styles, room types, flooring options)</li>
              <li>Interact with our recommendation system</li>
            </ul>
            <p>
              This information may include your name, email address, password, design preferences, and uploaded floor plan images.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and complete transactions</li>
              <li>Generate personalized design recommendations</li>
              <li>Send you technical notices, updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Develop new products and services</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data Storage and Security</h2>
            <p className="mb-4">
              We use Supabase, a secure database service, to store your account information and design preferences. Your password is securely hashed and not stored in plain text.
            </p>
            <p className="mb-4">
              Floor plan images you upload are processed by our AI system to detect room shapes and dimensions. These images are stored securely and used only for providing our design recommendation services.
            </p>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
            <p>
              Our application uses third-party services for authentication, data storage, and AI processing. These services have their own privacy policies, and we recommend you review their policies as well. Our key service providers include Supabase for authentication and database services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of your personal data</li>
              <li>Request deletion of your account and personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Withdraw consent where we rely on consent to process your personal data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@intelcor.com.
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

export default PrivacyPolicy;