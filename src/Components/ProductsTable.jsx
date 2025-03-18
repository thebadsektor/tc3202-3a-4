import React, { useState } from "react";

const ProductsTable = ({ initialProducts, categories, styles }) => {
  const [products, setProducts] = useState(initialProducts);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleAddProduct = () => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...newProduct, id: editingProduct.id }
            : p
        )
      );
    } else {
      setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    }
    setShowProductModal(false);
    setNewProduct({});
    setEditingProduct(null);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setProducts(products.filter((p) => p.id !== productToDelete.id));
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  return (
    <>
      <div className="bg-[#232936] rounded-lg">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Products</h2>
          <button
            onClick={() => {
              setEditingProduct(null);
              setNewProduct({});
              setShowProductModal(true);
            }}
            className="px-4 py-2 bg-[#4169E1] text-white !rounded-button flex items-center gap-2 cursor-pointer"
          >
            <i className="fas fa-plus"></i>
            <span>Add Product</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-left">
                <th className="px-6 py-3">IMAGE</th>
                <th className="px-6 py-3">PROCUCT NAME</th>
                <th className="px-6 py-3">CATEGORY</th>
                <th className="px-6 py-3">STYLE</th>
                <th className="px-6 py-3">EDIT</th>
                <th className="px-6 py-3">DELETE</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-[#374151]">
                  <td className="px-6 py-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{product.style}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setNewProduct(product);
                        setShowProductModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-600 p-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#232936] p-6 rounded-lg w-[500px]">
            <h2 className="text-white text-xl font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewProduct({ ...newProduct, image: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="w-full px-4 py-2 bg-[#1A1F2A] text-gray-400 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors"
                >
                  <div className="text-center">
                    <i className="fas fa-cloud-upload-alt text-2xl mb-2"></i>
                    <p>Upload Image</p>
                  </div>
                </label>
                {newProduct.image && (
                  <div className="mt-2">
                    <img
                      src={newProduct.image}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#1A1F2A] text-white rounded-lg border-none"
              />
              <select
                value={newProduct.category || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#1A1F2A] text-white rounded-lg border-none"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={newProduct.style || ""}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, style: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#1A1F2A] text-white rounded-lg border-none"
              >
                <option value="">Select Style</option>
                {styles.map((style) => (
                  <option key={style.id} value={style.name}>
                    {style.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setNewProduct({});
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white !rounded-button cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-[#4169E1] text-white !rounded-button cursor-pointer"
                >
                  {editingProduct ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#232936] p-6 rounded-lg w-[400px]">
            <h2 className="text-white text-xl font-semibold mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the product "
              {productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white !rounded-button cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white !rounded-button cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsTable;
