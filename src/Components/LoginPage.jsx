import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [invalidFields, setInvalidFields] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Get user metadata to determine role
        const { data: userData } = await supabase.auth.getUser();
        const userRole = userData.user?.user_metadata?.role || "user";

        // Redirect based on role
        navigate(userRole === "admin" ? "/admin" : "/user");
      }
    };

    checkUser();
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Please fill in all fields");
      setInvalidFields({
        email: !email,
        password: !password,
      });
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check user role from metadata and redirect accordingly
      const userRole = data.user?.user_metadata?.role || "user";

      // Store session if remember me is checked
      if (rememberMe) {
        localStorage.setItem("sb-auth-token", data.session?.access_token);
      }

      // Redirect based on user's role in metadata
      navigate(userRole === "admin" ? "/admin" : "/user");
    } catch (error) {
      console.error("Error logging in:", error.message);
      setErrorMsg(error.message || "Error logging in");

      // If error message contains "Invalid login credentials", highlight both fields
      if (error.message === "Invalid login credentials") {
        setInvalidFields({
          email: true,
          password: true,
        });
      }
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
          <h1 className="text-2xl font-bold text-white">Design Your Space</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>
        <div className="space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (invalidFields.email)
                  setInvalidFields({ ...invalidFields, email: false });
              }}
              className={`w-full px-4 py-3 ${
                invalidFields.email ? "border-2 border-red-500" : "border-none"
              } bg-[#2A303C] text-white rounded-lg text-sm focus:ring-2 focus:ring-[#4169E1]`}
            />
            <i className="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (invalidFields.password)
                  setInvalidFields({ ...invalidFields, password: false });
              }}
              className={`w-full px-4 py-3 ${
                invalidFields.password
                  ? "border-2 border-red-500"
                  : "border-none"
              } bg-[#2A303C] text-white rounded-lg text-sm focus:ring-2 focus:ring-[#4169E1]`}
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
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-400">Remember me</span>
            </label>
            <button
              onClick={() => handleNavigation("/forgot-password")}
              className="text-sm text-[#4169E1] hover:text-[#3154B3] cursor-pointer whitespace-nowrap"
            >
              Forgot password?
            </button>
          </div>
          {errorMsg && (
            <div className="text-red-500 text-sm text-center">{errorMsg}</div>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex justify-center items-center"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <button
              onClick={() => handleNavigation("/signup")}
              className="text-[#4169E1] hover:text-[#3154B3] cursor-pointer whitespace-nowrap"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
