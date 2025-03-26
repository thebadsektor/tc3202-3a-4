// User Page
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as echarts from "echarts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { supabase } from "../utils/supabaseClient";
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
  const [recommendations, setRecommendations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/"); // Navigate back to LoginPage.jsx
    } catch (error) {
      console.error("Error logging out:", error);
      showNotification("Logout failed. Please try again.");
    }
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const newRecommendations = [
      {
        id: 1,
        name: "Modern Leather Sofa",
        image:
          "https://public.readdy.ai/ai/img_res/2bd31258271307b2fa4c79f1d1e967a0.jpg",
        rating: 4.5,
        description: "Contemporary design with premium leather upholstery",
      },
      {
        id: 2,
        name: "Minimalist Coffee Table",
        image:
          "https://public.readdy.ai/ai/img_res/f8f90337cceda58c6064346f78770ed5.jpg",
        rating: 4.8,
        description: "Sleek wooden top with metal frame",
      },
      {
        id: 3,
        name: "Accent Chair",
        image:
          "https://public.readdy.ai/ai/img_res/772561a7f8343782d4c1a389189e1e5d.jpg",
        rating: 4.3,
        description: "Ergonomic design with premium fabric",
      },
    ];
    setRecommendations(newRecommendations);
    setIsGenerating(false);
    showNotification("New recommendations generated!");
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
              <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 text-white rounded-lg font-medium transition-colors !rounded-button whitespace-nowrap cursor-pointer">
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
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Select style</option>
                      <option value="Minimalist">Minimalist</option>
                      <option value="Modern">Modern</option>
                      <option value="Traditional">Traditional</option>
                      <option value="Industrial">Industrial</option>
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
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Select room</option>
                      <option value="Living Room">Living Room</option>
                      <option value="Bedroom">Bedroom</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="Office">Office</option>
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
                    onChange={(e) => setRoomSize(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter room size"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Upload Floor Plan
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      id="floorPlan"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          showNotification("Floor plan uploaded successfully!");
                        }
                      }}
                    />
                    <label
                      htmlFor="floorPlan"
                      className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors duration-200 cursor-pointer group"
                    >
                      <i className="fas fa-cloud-upload-alt mr-2 text-gray-400 group-hover:text-white"></i>
                      <span className="text-gray-400 group-hover:text-white">
                        Choose file or drag and drop
                      </span>
                    </label>
                    <div className="mt-2 text-sm text-gray-400">
                      Supported formats: JPG, PNG (Max size: 5MB)
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Preferred flooring type
                  </label>
                  <div className="relative">
                    <select
                      value={selectedFlooring}
                      onChange={(e) => setSelectedFlooring(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Select flooring</option>
                      <option value="Hardwood">Hardwood</option>
                      <option value="Carpet">Carpet</option>
                      <option value="Tile">Tile</option>
                      <option value="Laminate">Laminate</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400"></i>
                    </div>
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
                    setRecommendations([]);
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
            <div className="mt-8">
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
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {product.name}
                      </h4>
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
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
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
