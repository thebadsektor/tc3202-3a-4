// User Page
import React, { useState, useEffect, useRef } from "react";
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
  const profileMenuRef = useRef(null);
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
    // Add event listener to close profile menu when clicking outside
    const handleClickOutside = (event) => {
      // Check if the clicked element is the logout button
      const isLogoutButton = event.target.closest('button') && 
                            event.target.closest('button').textContent.trim() === 'Logout';
      
      // Only close the menu if it's not the logout button
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) && 
          showProfileMenu && !isLogoutButton) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu, profileMenuRef]);

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

  // Cache for storing quantity and size recommendations to avoid redundant API calls
  const [quantityCache, setQuantityCache] = useState({});
  const [sizeCache, setSizeCache] = useState({});

  // Modified to only handle flooring products - non-flooring products use the API
  const calculateProductQuantity = (roomSize, productName) => {
    // Basic quantity calculation based on room size
    const size = parseFloat(roomSize);

    // Check if this is the selected flooring product
    if (productName === selectedFlooring) {
      // For flooring products, calculate exact number of 12x12 inch tiles needed
      // 1 sq meter = 10.764 sq feet
      // 12x12 inch tile = 1 sq foot
      const sqFeet = size / 0.093;
      const tilesNeeded = Math.ceil(sqFeet);
      return tilesNeeded.toString();
    } else {
      // For non-flooring products, we should only use the cached API result
      // Check if we already have a cached result for this product and room size
      const cacheKey = `${productName}_${roomSize}`;
      if (quantityCache[cacheKey]) {
        return quantityCache[cacheKey];
      }
      
      // If no cached result, return empty string - will be filled by API
      return "";
    }
  };

  // Calculate product size - for flooring products it's fixed at 0.093 sqm
  const calculateProductSize = (roomSize, productName) => {
    // For flooring products, return fixed size of 0.093 sqm
    if (productName === selectedFlooring) {
      return "0.093 sqm";
    } else {
      // For non-flooring products, check the size cache
      const cacheKey = `${productName}_${roomSize}`;
      if (sizeCache[cacheKey]) {
        return sizeCache[cacheKey];
      }
      
      // If no cached result, return empty string - will be filled by API
      return "";
    }
  };
  
  // This function fetches quantities and sizes from the Gemini API for non-flooring products
  // Call this from a useEffect, not directly in render
  const fetchProductQuantity = (roomSize, productName, callback) => {
    // If it's flooring, calculate directly and return immediately
    const size = parseFloat(roomSize);
    if (productName === selectedFlooring) {
      const sqFeet = size / 0.093;
      const tilesNeeded = Math.ceil(sqFeet);
      callback(tilesNeeded.toString());
      return;
    }
    
    // Check if we already have a cached result for this product and room size
    const cacheKey = `${productName}_${roomSize}`;
    if (quantityCache[cacheKey]) {
      callback(quantityCache[cacheKey]);
      return;
    }
    
    // Call the backend API to get quantity and size recommendations
    fetch("http://localhost:8000/api/generate-quantity/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_name: productName,
        room_size: roomSize,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch product information");
      }
      return response.json();
    })
    .then(data => {
      // Ensure quantity is never less than 1
      let quantity = data.quantity;
      let productSize = data.size || "0.5 sqm"; // Default size if not provided
      
      // If quantity is a number, ensure it's at least 1
      if (!isNaN(parseInt(quantity)) && parseInt(quantity) < 1) {
        quantity = "1";
      }
      // If quantity is a range (e.g., "0-1"), ensure the lower bound is at least 1
      else if (quantity.includes("-")) {
        const parts = quantity.split("-");
        if (parts.length === 2 && !isNaN(parseInt(parts[0])) && parseInt(parts[0]) < 1) {
          quantity = `1-${parts[1]}`;
        }
      }
      
      // Cache the quantity result
      setQuantityCache(prev => ({
        ...prev,
        [cacheKey]: quantity
      }));
      
      // Cache the size result
      setSizeCache(prev => ({
        ...prev,
        [cacheKey]: productSize
      }));
      
      callback(quantity);
    })
    .catch(error => {
      console.error("Error getting product information:", error);
      // Use safe defaults if API call fails
      callback("1");
      
      // Set default size in cache
      setSizeCache(prev => ({
        ...prev,
        [`${productName}_${roomSize}`]: "0.5 sqm"
      }));
    });
  };
  
  // This function fetches product sizes from the cache or calculates them
  const fetchProductSize = (roomSize, productName, callback) => {
    // For flooring products, return fixed size
    if (productName === selectedFlooring) {
      callback("0.093 sqm");
      return;
    }
    
    // Check if we already have a cached result for this product and room size
    const cacheKey = `${productName}_${roomSize}`;
    if (sizeCache[cacheKey]) {
      callback(sizeCache[cacheKey]);
      return;
    }
    
    // If no cached result, we need to fetch from API (which will also update the cache)
    // This will indirectly update the size cache through fetchProductQuantity
    fetchProductQuantity(roomSize, productName, () => {
      // After fetchProductQuantity completes, the size should be in cache
      if (sizeCache[cacheKey]) {
        callback(sizeCache[cacheKey]);
      } else {
        // Fallback if still not in cache
        callback("0.5 sqm");
      }
    });
  };

  const getVisibleProducts = (products, roomSize) => {
    const size = parseFloat(roomSize);
    let numRows = products.length; // Default to all rows

    if (size < 15) {
      numRows = 2;
    } else if (size >= 15 && size <= 30) {
      numRows = 3;
    }

    // Calculate products per row (3 products per row in grid)
    const productsToShow = numRows * 3;
    return products.slice(0, productsToShow);
  };

  // Add the refreshProductData function INSIDE the component
  const refreshProductData = async () => {
    try {
      const productsData = await getProducts();
      const stylesData = await getStyles();
      const categoriesData = await getCategories();

      setStyles(stylesData);
      setCategories(
        categoriesData.filter((category) => category.name !== "Flooring")
      );
      setFlooringProducts(
        productsData.filter((product) => product.category === "Flooring")
      );

      return productsData;
    } catch (error) {
      console.error("Error refreshing product data:", error);
      return [];
    }
  };

  // Add the missing generateRecommendations function
  // Fix the generateRecommendations function to include all products
  const generateRecommendations = async () => {
    // Validate form fields
    const errors = {
      style: !selectedStyle,
      room: !selectedRoom,
      roomSize: !roomSize,
      flooring: !selectedFlooring,
      floorPlan: !selectedFile,
    };
    
    setValidationErrors(errors);
    
    // Check if any required fields are missing
    if (Object.values(errors).some((error) => error)) {
      showNotification("Please fill in all required fields");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Refresh product data to get the latest products
      const latestProducts = await refreshProductData();
      
      // First analyze the floor plan if uploaded
      if (selectedFile) {
        // Create a FormData object to send the file to the API
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        // Call the FastAPI endpoint for floorplan classification
        const floorplanResponse = await fetch(
          "http://localhost:8000/api/classify-floorplan",
          {
            method: "POST",
            body: formData,
          }
        );
        
        if (!floorplanResponse.ok) {
          throw new Error("Failed to classify floorplan");
        }
        
        const floorplanData = await floorplanResponse.json();
        setDetectedShape(floorplanData.shape);
        // Use manual size if provided, otherwise use the calculated size
        setCalculatedSize(roomSize ? `${roomSize} sqm` : floorplanData.size);
      }
      
      // Get recommendations from the API
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
            refreshData: true,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      
      const data = await response.json();
      
      // Get all products that match the selected style and room
      const matchingProducts = latestProducts.filter(
        product => 
          (product.style === selectedStyle && product.category === selectedRoom) ||
          (product.name === selectedFlooring && product.category === "Flooring")
      );
      
      // Make sure the selected flooring is included in the recommendations
      let recommendedProducts = data.products || [];
      
      // Check if the selected flooring is already in the recommendations
      const flooringIncluded = recommendedProducts.some(
        product => product.name === selectedFlooring
      );
      
      // If not included, find it from flooringProducts and add it
      if (!flooringIncluded && selectedFlooring) {
        const selectedFlooringProduct = flooringProducts.find(
          product => product.name === selectedFlooring
        );
        
        if (selectedFlooringProduct) {
          // Add the selected flooring to the recommendations
          recommendedProducts.push({
            name: selectedFlooringProduct.name,
            category: selectedFlooringProduct.category,
            style: selectedFlooringProduct.style,
            image: selectedFlooringProduct.image || selectedFlooringProduct.imageUrl,
            confidence: 100,
            recommendation_source: "rule_based"
          });
        }
      }
      
      // Add any new products that match our criteria but might not be in the ML model yet
      matchingProducts.forEach(product => {
        if (!recommendedProducts.some(p => p.name === product.name)) {
          recommendedProducts.push({
            name: product.name,
            category: product.category,
            style: product.style,
            image: product.image || product.imageUrl,
            confidence: 90,
            recommendation_source: "rule_based"
          });
        }
      });
      
      // Filter products based on room size
      const visibleProducts = getVisibleProducts(recommendedProducts, roomSize);
      
      // Sort products to show rule-based (new) products after ML products
      visibleProducts.sort((a, b) => {
        if (a.recommendation_source === b.recommendation_source) return 0;
        return a.recommendation_source === "ml_model" ? -1 : 1;
      });
      
      setRecommendations(visibleProducts);
      
      // Scroll to recommendations section
      setTimeout(() => {
        if (recommendationsRef.current) {
          recommendationsRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      
      showNotification("Recommendations generated successfully!");
    } catch (error) {
      console.error("Error generating recommendations:", error);
      showNotification("Failed to generate recommendations. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // State to store product quantities after they're fetched from the API
  const [productQuantities, setProductQuantities] = useState({});
  // State to track if all quantities have been loaded
  const [quantitiesLoading, setQuantitiesLoading] = useState(false);
  // State to track how many products need quantities
  const [pendingQuantities, setPendingQuantities] = useState(0);
  // State to track if all quantities are ready to display
  const [isAllQuantitiesReady, setIsAllQuantitiesReady] = useState(false);

  // Effect to fetch quantities when recommendations change
  useEffect(() => {
    // Process each recommendation in sequence
    if (recommendations.length > 0 && roomSize) {
      // Clear previous quantities and set loading states
      setProductQuantities({});
      setQuantitiesLoading(true);
      setIsAllQuantitiesReady(false);
      
      // Count how many non-flooring products need quantities
      const nonFlooringProducts = recommendations.filter(
        product => product.name !== selectedFlooring
      );
      
      // If there are no non-flooring products, we're done loading
      if (nonFlooringProducts.length === 0) {
        setQuantitiesLoading(false);
        setIsAllQuantitiesReady(true);
        return;
      }
      
      // Set the count of pending quantities
      setPendingQuantities(nonFlooringProducts.length);
      
      // Create a temporary object to store all quantities
      const tempQuantities = {};
      
      // Process each recommendation
      nonFlooringProducts.forEach(product => {
        // Use the fetchProductQuantity function to get quantities from the Gemini API
        fetchProductQuantity(roomSize, product.name, (quantity) => {
          tempQuantities[product.name] = quantity;
          
          // Decrease the pending count
          setPendingQuantities(prev => {
            const newCount = prev - 1;
            // If all quantities are loaded, update the state with all quantities at once
            if (newCount <= 0) {
              setProductQuantities(tempQuantities);
              setQuantitiesLoading(false);
              setIsAllQuantitiesReady(true);
            }
            return newCount;
          });
        });
      });
    }
  }, [recommendations, roomSize, selectedFlooring]);


  const renderRecommendations = () => {
    if (!isAllQuantitiesReady || quantitiesLoading) {
      return (
        <div className="flex items-center justify-center mt-8">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl mb-4 text-blue-500"></i>
            <p className="text-xl text-white">Calculating quantities...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {recommendations.map((product, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative"
          >
            {/* Add a "New" badge for rule-based recommendations */}
            {product.recommendation_source === "rule_based" && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </div>
            )}
            <div className="h-48 bg-gray-700 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-2">
                {product.name}
              </h3>
              <p className="text-gray-400 mb-2">
                Quantity: {product.name === selectedFlooring 
                  ? calculateProductQuantity(roomSize, product.name) 
                  : productQuantities[product.name]}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
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
        profileMenuRef={profileMenuRef}
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
          calculateProductSize={calculateProductSize}
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
