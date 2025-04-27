// User Page
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { preventBackNavigation } from "../utils/navigationControl";
import {
  getProducts,
  getCategories,
  getStyles,
} from "../utils/appwriteService";
import LogoutConfirmationModal from "./shared/LogoutConfirmationModal";

// Import components
import Navbar from "./UserPage/Navbar";
import HeroSection from "./UserPage/HeroSection";
import DesignForm from "./UserPage/DesignForm";
import StylesCarousel from "./UserPage/StylesCarousel";
import Toast from "./UserPage/Toast";
import Footer from "./LandingPage/Footer";

// Import required CSS for StylesCarousel
import "swiper/css";
import "swiper/css/pagination";

const UserPage = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomSize, setRoomSize] = useState("");
  const [selectedFlooring, setSelectedFlooring] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    style: false,
    room: false,
    roomSize: false,
    flooring: false,
    floorPlan: false,
  });
  const [recommendations, setRecommendations] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [styles, setStyles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [flooringProducts, setFlooringProducts] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const recommendationsRef = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setShowNavbar(true);
      } else {
        setShowNavbar(currentScrollY < lastScrollY);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // Prevent back navigation
    const cleanup = preventBackNavigation();
    return cleanup;
  }, []);

  useEffect(() => {
    // Fetch styles, categories and flooring products
    const fetchData = async () => {
      try {
        const stylesData = await getStyles();
        const categoriesData = await getCategories();
        const productsData = await getProducts();

        setStyles(stylesData);
        setCategories(
          categoriesData.filter((category) => category.name !== "Flooring")
        );
        setFlooringProducts(
          productsData.filter((product) => product.category === "Flooring")
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Check if the user is logged in
    const checkAuth = async () => {
      try {
        setLoading(true);
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          // No active session, redirect to login
          navigate("/login");
          return;
        }

        // Get user data
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData.user);
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getToastBackgroundColor = (message) => {
    return message === "Please fill in all required fields"
      ? "bg-red-500"
      : "bg-green-500";
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
    setShowProfileMenu(false);
  };

  const confirmLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login"); // Navigate back to LoginPage.jsx
    } catch (error) {
      console.error("Error logging out:", error);
      showNotification("Logout failed. Please try again.");
    } finally {
      setShowLogoutModal(false);
    }
  };

  const [detectedShape, setDetectedShape] = useState("");
  const [calculatedSize, setCalculatedSize] = useState("");

  const calculateProductQuantity = (roomSize, productName) => {
    // Basic quantity calculation based on room size
    const size = parseFloat(roomSize);

    // Check if this is the selected flooring product
    if (productName === selectedFlooring) {
      // For flooring products, calculate exact number of 12x12 inch tiles needed
      // 1 sq meter = 10.764 sq feet
      // 12x12 inch tile = 1 sq foot
      const sqFeet = size * 10.764;
      const tilesNeeded = Math.ceil(sqFeet);
      return tilesNeeded.toString();
    } else {
      // For non-flooring products, use the original calculation
      if (size < 15) return "1-2";
      if (size < 30) return "2-3";
      return "3-4";
    }
  };

  const getVisibleProducts = (products, roomSize) => {
    const size = parseFloat(roomSize);
    let numRows = 3; // Default to all rows

    if (size < 15) {
      numRows = 2;
    } else if (size >= 15 && size <= 30) {
      numRows = 3;
    }

    // Calculate products per row (3 products per row in grid)
    const productsToShow = numRows * 3;
    return products.slice(0, productsToShow);
  };

  const generateRecommendations = async () => {
    // Check for empty fields
    const errors = {
      style: !selectedStyle,
      room: !selectedRoom,
      roomSize: !roomSize,
      flooring: !selectedFlooring,
      floorPlan: !selectedFile,
    };

    setValidationErrors(errors);

    // If any field is empty, show error message and return
    if (Object.values(errors).some((error) => error)) {
      showNotification("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);

    try {
      // First analyze the floor plan if uploaded
      if (selectedFile) {
        const { analyzeFloorPlan } = await import("../utils/floorPlanAnalyzer");
        const { shape, size } = await analyzeFloorPlan(selectedFile, roomSize);
        setDetectedShape(shape);
        setCalculatedSize(size);
      }

      const response = await fetch(
        "http://localhost:8000/api/recommendations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room: selectedRoom,
            style: selectedStyle,
            flooring: selectedFlooring,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      // Filter products based on room size
      const visibleProducts = getVisibleProducts(data.products, roomSize);
      setRecommendations(visibleProducts);
      showNotification("New recommendations generated!");

      // Scroll to recommendations section after they're loaded
      setTimeout(() => {
        if (recommendationsRef.current) {
          recommendationsRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      showNotification("Failed to generate recommendations. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const questions = [
    {
      title: "What is your preferred style?",
      options: ["Minimalist", "Modern", "Traditional", "Industrial"],
      images: [
        "https://public.readdy.ai/ai/img_res/bf00de75b29476a2f81b5dc6828fbad9.jpg",
        "https://public.readdy.ai/ai/img_res/095affaf238156c18fbb1b13619b4d8d.jpg",
        "https://public.readdy.ai/ai/img_res/591477ce57f95b4ea23ac4a27fb62ebf.jpg",
        "https://public.readdy.ai/ai/img_res/b8dba8b0bac3cb51a49b4040b936cff8.jpg",
      ],
    },
    {
      title: "Which room would you like to design?",
      options: ["Living Room", "Bedroom", "Kitchen", "Office"],
      images: [
        "https://public.readdy.ai/ai/img_res/77c827ce40985130c54e6a5f6eb4d88c.jpg",
        "https://public.readdy.ai/ai/img_res/1663f76cbd6787f35e72f5a46ee5da01.jpg",
        "https://public.readdy.ai/ai/img_res/09c122e5a6883f29c286e84580b649df.jpg",
        "https://public.readdy.ai/ai/img_res/e7923b80b8c2e7aa814e976ec79fc485.jpg",
      ],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl mb-4 text-blue-500"></i>
          <p className="text-xl text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />

      <Navbar
        showNavbar={showNavbar}
        user={user}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        handleLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <HeroSection />
        <DesignForm
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          roomSize={roomSize}
          setRoomSize={setRoomSize}
          selectedFlooring={selectedFlooring}
          setSelectedFlooring={setSelectedFlooring}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          styles={styles}
          categories={categories}
          flooringProducts={flooringProducts}
          isGenerating={isGenerating}
          generateRecommendations={generateRecommendations}
          recommendations={recommendations}
          showNotification={showNotification}
          recommendationsRef={recommendationsRef}
          setRecommendations={setRecommendations}
          detectedShape={detectedShape}
          calculatedSize={calculatedSize}
          calculateProductQuantity={calculateProductQuantity}
        />

        <StylesCarousel questions={questions} />

        <Toast
          showToast={showToast}
          toastMessage={toastMessage}
          getToastBackgroundColor={getToastBackgroundColor}
        />
      </main>
      <Footer />
    </div>
  );
};

export default UserPage;
