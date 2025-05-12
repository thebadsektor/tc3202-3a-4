import React from "react";

const HeroSection = () => {
  return (
    <div className="relative mb-12 rounded-xl overflow-hidden">
      <img
        src="https://public.readdy.ai/ai/img_res/1b99a5b9ec0ec723b84a6795e3bd6115.jpg"
        alt="Hero Background"
        className="w-full h-96 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent flex items-center">
        <div className="p-8 max-w-lg">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            IntelCor
          </h1>
          <p className="text-lg text-gray-200 mb-6">
            Experience the future of interior design with our AI-powered room
            design assistant. Create your perfect space in minutes.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-3 text-white rounded-lg font-medium transition-colors !rounded-button whitespace-nowrap cursor-pointer"
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
  );
};

export default HeroSection;
