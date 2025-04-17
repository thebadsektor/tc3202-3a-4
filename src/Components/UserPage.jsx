// User Page
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as echarts from "echarts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { supabase } from "../utils/supabaseClient";
import {
  getProducts,
  getCategories,
  getStyles,
} from "../utils/appwriteService";
import LogoutConfirmationModal from "./shared/LogoutConfirmationModal";
import "swiper/css";
import "swiper/css/pagination";

const UserPage = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
          navigate("/");
          return;
        }

        // Get user data
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData.user);
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/");
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
      navigate("/"); // Navigate back to LoginPage.jsx
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
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src="/intellcor.png" alt="Company Logo" className="h-15" />
            </div>
            <div className="flex items-center relative">
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center cursor-pointer px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="text-gray-300 mr-2">
                  {user?.email || "user@example.com"}
                </span>
                <i className="fas fa-user-circle text-2xl text-gray-300"></i>
              </div>
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setShowProfileMenu(false);
                      }}
                    >
                      User Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative mb-12 rounded-xl overflow-hidden">
          <img
            src="https://public.readdy.ai/ai/img_res/1b99a5b9ec0ec723b84a6795e3bd6115.jpg"
            alt="Hero Background"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent flex items-center">
            <div className="p-8 max-w-lg">
              <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                IntellCor
              </h1>
              <p className="text-lg text-gray-200 mb-6">
                Experience the future of interior design with our AI-powered
                room design assistant. Create your perfect space in minutes.
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-600 px-8 py-3 text-white rounded-lg font-medium transition-colors !rounded-button whitespace-nowrap cursor-pointer"
                onClick={() => {
                  document
                    .querySelector(".bg-gray-800.rounded-lg.shadow-xl")
                    .scrollIntoView({ behavior: "smooth" });
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Design Your Perfect Space
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    What is your preferred style?
                  </label>
                  <div className="relative">
                    <select
                      value={selectedStyle}
                      onChange={(e) => {
                        setSelectedStyle(e.target.value);
                        setValidationErrors((prev) => ({
                          ...prev,
                          style: false,
                        }));
                      }}
                      className={`w-full px-4 py-2 bg-gray-700 text-white border ${
                        validationErrors.style
                          ? "border-red-500"
                          : "border-gray-600"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none`}
                    >
                      <option value="">Select style</option>
                      {styles.map((style) => (
                        <option key={style.id} value={style.name}>
                          {style.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Which room would you like to design?
                  </label>
                  <div className="relative">
                    <select
                      value={selectedRoom}
                      onChange={(e) => {
                        setSelectedRoom(e.target.value);
                        setValidationErrors((prev) => ({
                          ...prev,
                          room: false,
                        }));
                      }}
                      className={`w-full px-4 py-2 bg-gray-700 text-white border ${
                        validationErrors.room
                          ? "border-red-500"
                          : "border-gray-600"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none`}
                    >
                      <option value="">Select room</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    What is the size of your room? (in square meters)
                  </label>
                  <input
                    type="number"
                    value={roomSize}
                    onChange={(e) => {
                      setRoomSize(e.target.value);
                      setValidationErrors((prev) => ({
                        ...prev,
                        roomSize: false,
                      }));
                    }}
                    className={`w-full px-4 py-2 bg-gray-700 text-white border ${
                      validationErrors.roomSize
                        ? "border-red-500"
                        : "border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter room size"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Preferred flooring type
                  </label>
                  <div className="relative">
                    <select
                      value={selectedFlooring}
                      onChange={(e) => {
                        setSelectedFlooring(e.target.value);
                        setValidationErrors((prev) => ({
                          ...prev,
                          flooring: false,
                        }));
                      }}
                      className={`w-full px-4 py-2 bg-gray-700 text-white border ${
                        validationErrors.flooring
                          ? "border-red-500"
                          : "border-gray-600"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none`}
                    >
                      <option value="">Select flooring</option>
                      {flooringProducts.map((product) => (
                        <option key={product.id} value={product.name}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-200 mb-2 text-center">
                  Upload Floor Plan
                </label>
                <div className="relative max-w-md mx-auto">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    id="floorPlan"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        if (
                          ["image/jpeg", "image/jpg", "image/png"].includes(
                            file.type
                          )
                        ) {
                          setSelectedFile(file);
                          setValidationErrors((prev) => ({
                            ...prev,
                            floorPlan: false,
                          }));
                          showNotification("Floor plan uploaded successfully!");
                        } else {
                          showNotification(
                            "Please upload only JPG, JPEG or PNG files."
                          );
                        }
                      }
                    }}
                  />
                  {!selectedFile ? (
                    <label
                      htmlFor="floorPlan"
                      className={`w-full flex flex-col items-center justify-center p-8 bg-gray-700 border-2 border-dashed ${
                        validationErrors.floorPlan
                          ? "border-red-500"
                          : "border-gray-600"
                      } rounded-lg hover:border-blue-500 transition-colors duration-200 cursor-pointer group`}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.classList.add(
                          "border-blue-500",
                          "bg-gray-600",
                          "ring-2",
                          "ring-blue-400"
                        );
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.classList.add(
                          "border-blue-500",
                          "bg-gray-600"
                        );
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.classList.remove(
                          "border-blue-500",
                          "bg-gray-600",
                          "ring-2",
                          "ring-blue-400"
                        );
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.classList.remove(
                          "border-blue-500",
                          "bg-gray-600",
                          "ring-2",
                          "ring-blue-400"
                        );

                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          const file = e.dataTransfer.files[0];
                          if (
                            ["image/jpeg", "image/jpg", "image/png"].includes(
                              file.type
                            )
                          ) {
                            setSelectedFile(file);
                            setValidationErrors((prev) => ({
                              ...prev,
                              floorPlan: false,
                            }));
                            showNotification(
                              "Floor plan uploaded successfully!"
                            );
                          } else {
                            showNotification(
                              "Please upload only JPG, JPEG or PNG files."
                            );
                          }
                        }
                      }}
                    >
                      <i className="fas fa-cloud-upload-alt text-4xl mb-2 text-gray-400 group-hover:text-blue-400"></i>
                      <span className="text-gray-400 group-hover:text-blue-400 mb-1">
                        Drag and drop files here
                      </span>
                      <span className="text-sm text-gray-500 group-hover:text-blue-400">
                        or click to browse
                      </span>
                    </label>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-full h-full object-contain bg-gray-700 rounded-lg"
                      />
                      <p className="text-white text-sm">{selectedFile.name}</p>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-red-400 text-xs hover:text-red-300 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-400 text-center">
                    Supported formats: JPG, JPEG, PNG (Max size: 5MB)
                  </div>
                </div>
              </div>
              <button
                onClick={generateRecommendations}
                disabled={isGenerating}
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700
                hover:to-indigo-700 transition duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Generating recommendations...
                  </>
                ) : (
                  "Generate Recommendations"
                )}
              </button>
              {recommendations.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedStyle("");
                    setSelectedRoom("");
                    setRoomSize("");
                    setSelectedFlooring("");
                    setSelectedFile(null);
                    setRecommendations([]);
                    setValidationErrors({
                      style: false,
                      room: false,
                      roomSize: false,
                      flooring: false,
                      floorPlan: false,
                    });
                    document
                      .querySelector(".bg-gray-800.rounded-lg.shadow-xl")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-4 w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-red-700 hover:to-pink-700 transition duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Start Over
                </button>
              )}
            </div>
          </div>
          {recommendations.length > 0 && (
            <div className="mt-8" ref={recommendationsRef}>
              {detectedShape && (
                <div className="mb-6">
                  <h4 className="text-2xl font-bold text-white mb-2">
                    Floor Plan Analysis
                  </h4>
                  <p className="text-2xl font-bold text-gray-300">
                    Detected Shape: {detectedShape}
                  </p>
                  <p className="text-2xl font-bold text-gray-300">
                    Calculated Size: {calculatedSize}
                  </p>
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-6">
                Recommended Products
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-contain bg-white"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {product.name}
                      </h4>
                      <p className="text-gray-400 text-sm mb-2">
                        Quantity:{" "}
                        {calculateProductQuantity(roomSize, product.name)} pcs
                      </p>
                      {/* <p className="text-gray-400 text-sm mb-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">
                          
                        </span>
                        <div className="flex items-center">
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          <span className="text-gray-400">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                      <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                        Add to Cart
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {showToast && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${getToastBackgroundColor(
              toastMessage
            )} text-white px-6 py-3 rounded-lg shadow-lg z-50`}
          >
            {toastMessage}
          </div>
        )}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-8">
            Popular Design Styles
          </h2>
          <style>
            {`
             @import 'swiper/css';
             @import 'swiper/css/pagination';
             @import 'swiper/css/autoplay';

             .swiper {
               width: 100%;
               padding-bottom: 40px;
             }

             .swiper-slide {
               width: 33.333%;
               height: auto;
             }

             .swiper-pagination {
               bottom: 0;
             }

             .swiper-pagination-bullet {
               background: #ffffff;
               opacity: 0.5;
             }

             .swiper-pagination-bullet-active {
               background: #ffffff;
               opacity: 1;
             }
           `}
          </style>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={3}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="mb-8"
          >
            {questions[0].images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative group cursor-pointer">
                  <img
                    src={image}
                    alt={questions[0].options[index]}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-xl font-semibold">
                      {questions[0].options[index]}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </main>
    </div>
  );
};

export default UserPage;
