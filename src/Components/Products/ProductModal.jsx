import React from "react";
import Modal from "../shared/Modal";

const ProductModal = ({
  showModal,
  setShowModal,
  editingProduct,
  newProduct,
  setNewProduct,
  handleAddProduct,
  categories,
  styles,
}) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        setNewProduct({});
      }}
      title={editingProduct ? "Edit Product" : "Add New Product"}
    >
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
              setShowModal(false);
              setNewProduct({});
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
    </Modal>
  );
};

export default ProductModal;
