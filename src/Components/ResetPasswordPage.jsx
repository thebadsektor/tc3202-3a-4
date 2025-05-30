import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (!password || !confirmPassword) {
      return "Please fill in all fields";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return "Password must have at least 8 characters, an uppercase letter, a lowercase letter, and a number";
    }
    return null;
  };

  const handleResetPassword = async () => {
    // Clear previous messages
    setErrorMsg("");
    setSuccessMsg("");

    // Validate passwords
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrorMsg(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccessMsg("Password has been updated successfully");
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error updating password:", error.message);
      setErrorMsg(error.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background with image overlay */}
      <div 
        className="absolute inset-0 bg-[#1A1F2A] z-0"
        style={{
          backgroundImage: 'url(/login_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          
        }}
      ></div>
      <div className="w-full max-w-md backdrop-filter backdrop-blur-sm rounded-lg shadow-xl p-8 z-10 relative" style={{ backgroundColor: 'rgba(35, 41, 54, 0.7)' }}>
        <div className="text-center mb-8">
          <img
            src="/intellcor.png"
            alt="Logo"
            className="mx-auto h-25 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
          <p className="text-gray-400 mt-2">Please enter your new password</p>
        </div>
        <div className="space-y-6">
          <div className="relative">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border-none bg-[#2A303C] text-white rounded-lg text-sm focus:ring-2 focus:ring-[#4169E1]"
            />
            <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-none bg-[#2A303C] text-white rounded-lg text-sm focus:ring-2 focus:ring-[#4169E1]"
            />
            <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
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
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex justify-center items-center"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
          <div className="text-center text-sm text-gray-400">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login")}
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

export default ResetPasswordPage;
