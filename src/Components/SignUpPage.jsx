import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role, // Store role in user metadata
          },
        },
      });

      if (error) throw error;

      // Show success and redirect to login
      alert(
        "Registration successful! Please check your email for verification."
      );
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error.message);
      setErrorMsg(error.message || "Error signing up");
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
          <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
          <p className="text-gray-400 mt-2">Join LuxHome today</p>
          <div className="flex justify-center space-x-6 mt-4">
            <button
              className={`px-6 py-2 !rounded-button whitespace-nowrap cursor-pointer ${
                role === "user"
                  ? "bg-[#4169E1] text-white"
                  : "bg-[#2A303C] text-gray-400"
              }`}
              onClick={() => setRole("user")}
            >
              <i className="fas fa-user mr-2"></i>
              User
            </button>
            <button
              className={`px-6 py-2 !rounded-button whitespace-nowrap cursor-pointer ${
                role === "admin"
                  ? "bg-[#4169E1] text-white"
                  : "bg-[#2A303C] text-gray-400"
              }`}
              onClick={() => setRole("admin")}
            >
              <i className="fas fa-user-shield mr-2"></i>
              Admin
            </button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-none bg-[#2A303C] text-white !rounded-button text-sm focus:ring-2 focus:ring-[#4169E1]"
            />
            <i className="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-none bg-[#2A303C] text-white !rounded-button text-sm focus:ring-2 focus:ring-[#4169E1]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-none bg-[#2A303C] text-white !rounded-button text-sm focus:ring-2 focus:ring-[#4169E1]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              <i
                className={`fas ${
                  showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </button>
          </div>
          {errorMsg && (
            <div className="text-red-500 text-sm text-center">{errorMsg}</div>
          )}
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-[#4169E1] text-white py-3 !rounded-button hover:bg-[#3154B3] transition-colors cursor-pointer whitespace-nowrap flex justify-center items-center"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              onClick={handleSignIn}
              className="text-[#4169E1] hover:text-[#3154B3] cursor-pointer whitespace-nowrap"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
