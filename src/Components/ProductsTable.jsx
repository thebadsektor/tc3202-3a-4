import React, { useState, useEffect, useRef } from "react";
import TableHeader from "./shared/Table/TableHeader";
import ProductTableRow from "./Products/ProductTableRow";
import ProductModal from "./Products/ProductModal";
import Modal from "./shared/Modal";
import Toast from "./shared/Toast";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../utils/appwriteService";

const ProductsTable = ({ initialProducts, categories, styles }) => {
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [sortOption, setSortOption] = useState(() => {
    // Get saved sort option from localStorage or default to "newest"
    return localStorage.getItem("productSortOption") || "newest";
  });
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddProduct = async () => {
    try {
      // Validate required fields
      if (!newProduct.name || !newProduct.category || !newProduct.style) {
        showNotification("Please fill in all required fields (Name, Category, and Style)", "error");
        return;
      }

      // Check for duplicate product name
      const duplicateProduct = products.find(
        (p) =>
          p.name.toLowerCase() === newProduct.name.toLowerCase() &&
          (!editingProduct || p.id !== editingProduct.id)
      );

      // Check for duplicate image if a new image is being uploaded
      const duplicateImage =
        newProduct.image &&
        products.some(
          (p) =>
            p.image === newProduct.image &&
            (!editingProduct || p.id !== editingProduct.id)
        );

      if (duplicateProduct || duplicateImage) {
        showNotification("Unable to save Product. Product Name already exist!", "error");
        return;
      }

      // Prepare product data with default values for optional fields
      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        style: newProduct.style,

        image: newProduct.image || "",
      };

      let savedProduct;
      if (editingProduct) {
        // Update existing product
        savedProduct = await updateProduct(editingProduct.id, productData);
      } else {
        // Create new product
        savedProduct = await createProduct(productData);
      }

      if (savedProduct) {
        if (editingProduct) {
          setProducts(
            products.map((p) => (p.id === editingProduct.id ? savedProduct : p))
          );
        } else {
          setProducts([...products, savedProduct]);
        }
        setShowProductModal(false);
        setNewProduct({});
        setEditingProduct(null);

        // Show success notification
        if (editingProduct) {
          showNotification("Product edited successfully");
        } else {
          showNotification("Product added successfully");
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      showNotification("Failed to save product. Please check all fields and try again.", "error");
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(productToDelete.id);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      showNotification("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("Failed to delete product. Please try again.", "error");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowProductModal(true);
  };

  // Save sort option to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("productSortOption", sortOption);
  }, [sortOption]);

  // Filter and sort products based on search term and sort option
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercasedSearch) ||
          product.category.toLowerCase().includes(lowercasedSearch) ||
          product.style.toLowerCase().includes(lowercasedSearch)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        // Assuming newer items are at the end of the array
        filtered = [...filtered].reverse();
        break;
      case "oldest":
        // Keep original order (assuming older items are at the beginning)
        break;
      case "alphabetical":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, products, sortOption]);

  return (
    <>
    <Toast 
        showToast={showToast} 
        toastMessage={toastMessage} 
        toastType={toastType} 
      />
      <div className="bg-[#232936] rounded-lg">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Products</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Filter/Sort Button with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className={`p-2 text-white rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                    showSortDropdown
                      ? "bg-[#2A303D]"  // Active color
                      : "bg-[#1A1F2A] hover:bg-[#2A303D]"  // Inactive color
                  }`}
                  title="Sort products"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 8h16M4 16h10"></path>
                    <path d="M8 4v16"></path>
                    <path d="M16 4v6"></path>
                  </svg>
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1F2A] rounded-lg shadow-lg z-10">
                    <ul className="py-1">
                      <li
                        className={`px-4 py-2 hover:bg-[#2A303D] cursor-pointer ${
                          sortOption === "newest"
                            ? "text-blue-400"
                            : "text-white"
                        }`}
                        onClick={() => {
                          setSortOption("newest");
                          setShowSortDropdown(false);
                        }}
                      >
                        Newest Added
                      </li>
                      <li
                        className={`px-4 py-2 hover:bg-[#2A303D] cursor-pointer ${
                          sortOption === "oldest"
                            ? "text-blue-400"
                            : "text-white"
                        }`}
                        onClick={() => {
                          setSortOption("oldest");
                          setShowSortDropdown(false);
                        }}
                      >
                        Oldest Added
                      </li>
                      <li
                        className={`px-4 py-2 hover:bg-[#2A303D] cursor-pointer ${
                          sortOption === "alphabetical"
                            ? "text-blue-400"
                            : "text-white"
                        }`}
                        onClick={() => {
                          setSortOption("alphabetical");
                          setShowSortDropdown(false);
                        }}
                      >
                        Alphabetical
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 bg-[#1A1F2A] text-white rounded-lg border-none w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setNewProduct({});
                setShowProductModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-plus"></i>
              <span>Add Product</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div
            className="max-h-[calc(8*56px)] overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#4169E1 #1A1F2A",
            }}
          >
            <table className="w-full">
              <TableHeader
                columns={[
                  "image",
                  "procuct name",
                  "category",
                  "style",
                  "edit",
                  "delete",
                ]}
              />
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductTableRow
                      key={product.id}
                      product={product}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <img
                          src="/no-results.png"
                          alt="No Results"
                          className="w-15 h-15 text-red-400"
                        />
                        <p className="text-lg font-bold mb-2">No Products Found</p>
                        <p>Please try again with different keywords.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProductModal
        showModal={showProductModal}
        setShowModal={setShowProductModal}
        editingProduct={editingProduct}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        handleAddProduct={handleAddProduct}
        categories={categories}
        styles={styles}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Confirm Delete"
        >
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete the product "{productToDelete?.name}
            "? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProductsTable;
