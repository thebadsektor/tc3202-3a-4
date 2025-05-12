import React from "react";

const DesignForm = ({
  selectedStyle,
  setSelectedStyle,
  selectedRoom,
  setSelectedRoom,
  roomSize,
  setRoomSize,
  selectedFlooring,
  setSelectedFlooring,
  selectedFile,
  setSelectedFile,
  validationErrors,
  setValidationErrors,
  styles,
  categories,
  flooringProducts,
  isGenerating,
  generateRecommendations,
  recommendations,
  showNotification,
  recommendationsRef,
  detectedShape,
  calculatedSize,
  calculateProductQuantity,
  calculateProductSize,
  setRecommendations,
}) => {
  // Move the handleDownloadPDF function inside the component
  const handleDownloadPDF = async () => {
    if (recommendations.length === 0) {
      showNotification("Please generate recommendations first");
      return;
    }

    // Show notification first
    showNotification("Generating PDF, please wait...");

    try {
      // Dynamically import required libraries
      const [jsPDFModule, html2canvasModule] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const jsPDF = jsPDFModule.default;
      const html2canvas = html2canvasModule.default;

      // Create PDF document with background color
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Set background color for all pages
      const setPageBackgroundColor = (pdf) => {
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        pdf.setFillColor(35, 41, 54); // #232936 in RGB
        pdf.rect(0, 0, width, height, "F");
      };

      // Apply background color to first page
      setPageBackgroundColor(pdf);

      // First, create a visual representation of the form data
      const formDataElement = document.createElement("div");
      formDataElement.style.width = "800px";
      formDataElement.style.padding = "20px";
      formDataElement.style.backgroundColor = "#232936"; // Dark theme background
      formDataElement.style.color = "#ffffff"; // Light text for dark background
      formDataElement.style.fontFamily = "Arial, sans-serif";
      formDataElement.style.boxSizing = "border-box";

      // Add title and form data
      formDataElement.innerHTML = `
        <h1 style="text-align: center; color: #ffffff; margin-bottom: 20px; font-size: 24px;">Design Your Perfect Space</h1>
        <div style="margin-bottom: 30px;">
          <div style="margin-bottom: 10px;">
            <span style="font-weight: bold; color: #ffffff;">Style:</span> <span style="color: #e2e8f0;">${
              selectedStyle || "Not selected"
            }</span>
          </div>
          <div style="margin-bottom: 10px;">
            <span style="font-weight: bold; color: #ffffff;">Room:</span> <span style="color: #e2e8f0;">${
              selectedRoom || "Not selected"
            }</span>
          </div>
          <div style="margin-bottom: 10px;">
            <span style="font-weight: bold; color: #ffffff;">Room Size:</span> <span style="color: #e2e8f0;">${
              roomSize || "Not specified"
            } sq meters</span>
          </div>
          <div style="margin-bottom: 10px;">
            <span style="font-weight: bold; color: #ffffff;">Flooring:</span> <span style="color: #e2e8f0;">${
              selectedFlooring || "Not selected"
            }</span>
          </div>
        </div>
      `;

      // Add floor plan analysis if available
      if (detectedShape) {
        formDataElement.innerHTML += `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #ffffff; margin-bottom: 10px; font-size: 20px font-weight: bold;">Floor Plan Analysis</h2>
            <div style="margin-bottom: 5px;">
              <span style="font-weight: bold; color: #ffffff;">Detected Shape:</span> <span style="color: #e2e8f0;">${detectedShape}</span>
            </div>
            <div style="margin-bottom: 5px;">
              <span style="font-weight: bold; color: #ffffff;">Room Size:</span> <span style="color: #e2e8f0;">${calculatedSize}</span>
            </div>
          </div>
        `;
      }

      // COMPLETELY NEW APPROACH: Create a simplified version of recommendations
      // that guarantees no duplicates by using a direct approach
      if (recommendations.length > 0) {
        // First, deduplicate the recommendations by name
        const uniqueProductsMap = {};
        recommendations.forEach((product) => {
          // Only add if we haven't seen this product name before
          if (!uniqueProductsMap[product.name]) {
            uniqueProductsMap[product.name] = product;
          }
        });

        // Convert to array
        const uniqueProducts = Object.values(uniqueProductsMap);

        // Add the recommendations header
        formDataElement.innerHTML += `
          <h2 style="color: #ffffff; margin-bottom: 15px; font-size: 20px; font-weight: bold;">Recommended Products</h2>
        `;

        // Create a container for the products
        const productsContainer = document.createElement("div");
        productsContainer.style.display = "grid";
        productsContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
        productsContainer.style.gap = "15px";

        // Add each product to the container
        uniqueProducts.forEach((product) => {
          const productCard = document.createElement("div");
          productCard.style.border = "1px solid #444";
          productCard.style.borderRadius = "8px";
          productCard.style.overflow = "hidden";
          productCard.style.backgroundColor = "#1A1F2A";
          productCard.style.marginBottom = "15px";

          // Create image container
          const imgContainer = document.createElement("div");
          imgContainer.style.width = "100%";
          imgContainer.style.height = "200px";
          imgContainer.style.backgroundColor = "#ffffff";
          imgContainer.style.display = "flex";
          imgContainer.style.justifyContent = "center";
          imgContainer.style.alignItems = "center";

          // Create image element
          const img = document.createElement("img");
          img.src = product.image;
          img.alt = product.name;
          img.style.maxWidth = "100%";
          img.style.maxHeight = "100%";
          img.style.objectFit = "contain";
          imgContainer.appendChild(img);

          // Create product info container
          const productInfo = document.createElement("div");
          productInfo.style.padding = "15px";

          // Calculate the correct quantity and size using the same functions as the UI
          const quantity = calculateProductQuantity(roomSize, product.name);
          const size = calculateProductSize(roomSize, product.name);

          // Add product name, quantity and size
          productInfo.innerHTML = `
            <h3 style="color: #ffffff; margin-bottom: 5px; font-size: 16px;">${product.name}</h3>
            <p style="color: #a0aec0; margin-bottom: 5px; font-size: 14px;">Quantity: ${quantity} pcs</p>
            <p style="color: #a0aec0; font-size: 14px;">Approx. Size: ${size}</p>
          `;

          // Assemble the product card
          productCard.appendChild(imgContainer);
          productCard.appendChild(productInfo);
          productsContainer.appendChild(productCard);
        });

        // Add the products container to the form data element
        formDataElement.appendChild(productsContainer);
      }

      // Add the form data element to the document body temporarily
      document.body.appendChild(formDataElement);

      // Render the form data element to canvas
      const canvas = await html2canvas(formDataElement, {
        scale: 1,
        useCORS: true,
        logging: false,
        backgroundColor: "#232936",
      });

      // Remove the form data element from the document body
      document.body.removeChild(formDataElement);

      // Add the canvas to the PDF
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the PDF
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

      // If the image is taller than the page, add more pages as needed
      let heightLeft = imgHeight;
      let position = 0;

      // Remove the first page (we'll add it back with proper content)
      if (heightLeft > pdf.internal.pageSize.getHeight()) {
        pdf.deletePage(1);
        heightLeft = imgHeight;
        position = 0;

        while (heightLeft > 0) {
          // Add a new page
          pdf.addPage();
          setPageBackgroundColor(pdf);

          // Calculate position and height for this page
          position = heightLeft - imgHeight;
          const pageHeight = pdf.internal.pageSize.getHeight();

          // Add the image to the page
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);

          // Reduce the height left
          heightLeft -= pageHeight;
        }
      }

      // Save the PDF
      pdf.save("IntelCor_recommendations.pdf");
      showNotification("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showNotification("Failed to generate PDF. Please try again.");
    }
  };

  return (
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
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer`}
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
                    validationErrors.room ? "border-red-500" : "border-gray-600"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer`}
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
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer`}
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
                        showNotification("Floor plan uploaded successfully!");
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
            <div>
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
              <button
                onClick={handleDownloadPDF}
                className="mt-4 w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition duration-200 !rounded-button whitespace-nowrap cursor-pointer flex items-center justify-center"
              >
                <i className="fas fa-download mr-2"></i>
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
      {recommendations.length > 0 && (
        <div ref={recommendationsRef} className="mt-12">
          {detectedShape && (
            <div className="mb-6">
              <h4 className="text-2xl font-bold text-white mb-2">
                Floor Plan Analysis
              </h4>
              <p className="text-2xl font-bold text-gray-300">
                Detected Shape: {detectedShape}
              </p>
              <p className="text-2xl font-bold text-gray-300">
                Room Size: {calculatedSize}
              </p>
            </div>
          )}
          <h3 className="text-2xl font-bold text-white mb-6">
            Recommended Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((product, index) => (
              <div
                key={product.id || `product-${index}`}
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
                    Quantity: {calculateProductQuantity(roomSize, product.name)}{" "}
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    Approx. Size: {calculateProductSize(roomSize, product.name)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignForm;
