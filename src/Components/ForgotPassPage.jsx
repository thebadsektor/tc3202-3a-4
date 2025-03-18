import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const ForgotPassPage = () => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMsg("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      // Request password reset with Supabase
      // The reset links will be automatically sent by Supabase to the user's email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccessMsg("Password reset instructions have been sent to your email");
    } catch (error) {
      console.error("Error resetting password:", error.message);
      setErrorMsg(error.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#1A1F2A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#232936] rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <img
            src="https://public.readdy.ai/ai/img_res/e6b2ac1ef790d583a30d00c72a2a0417.jpg"
            alt="Logo"
            className="mx-auto h-16 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
          <p className="text-gray-400 mt-2">
            Enter your email to receive reset instructions
          </p>
        </div>
        <div className="space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-none bg-[#2A303C] text-white rounded-lg text-sm focus:ring-2 focus:ring-[#4169E1]"
            />
            <i className="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          {errorMsg && (
            <div className="text-red-500 text-sm text-center">{errorMsg}</div>
          )}
          {successMsg && (
            <div className="text-green-500 text-sm text-center">
              {successMsg}
            </div>
          )}
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-[#4169E1] text-white py-3 rounded-lg hover:bg-[#3154B3] transition-colors cursor-pointer flex justify-center items-center"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Sending...
              </>
            ) : (
              "Send Reset Instructions"
            )}
          </button>
          <div className="text-center text-sm text-gray-400">
            Remember your password?{" "}
            <button
              onClick={handleSignIn}
              className="text-[#4169E1] hover:text-[#3154B3] cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;
