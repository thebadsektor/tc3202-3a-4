import React from "react";

const Recommendations = ({
  recommendations,
  recommendationsRef,
  detectedShape,
  calculatedSize,
  roomSize,
  calculateProductQuantity,
  calculateProductSize,
}) => {
  if (recommendations.length === 0) return null;

  return (
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
                Quantity: {calculateProductQuantity(roomSize, product.name)} pcs
              </p>
              <p className="text-gray-400 text-sm mb-2">
                Approx. Size: {calculateProductSize(roomSize, product.name)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
