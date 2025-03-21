import React from "react";
import Modal from "../shared/Modal";
import { storage, bucketId } from "../../utils/appwriteConfig";
import { ID, Query } from "appwrite";

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
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  // Check for duplicate filename in storage
                  const fileList = await storage.listFiles(bucketId);
                  const isDuplicate = fileList.files.some(
                    (existingFile) => existingFile.name === file.name
                  );

                  if (isDuplicate) {
                    alert(
                      "A file with this name already exists. Please rename the file before uploading."
                    );
                    return;
                  }
                  // If there's an existing image, delete it first
                  if (newProduct.image) {
                    const oldFileId = newProduct.image
                      .split("/files/")[1]
                      .split("/view")[0];
                    try {
                      await storage.deleteFile(bucketId, oldFileId);
                    } catch (deleteError) {
                      console.error("Error deleting old image:", deleteError);
                    }
                  }
                  const fileId = ID.unique();
                  const uploadResponse = await storage.createFile(
                    bucketId,
                    fileId,
                    file
                  );
                  const fileUrl = `${
                    import.meta.env.VITE_APPWRITE_ENDPOINT
                  }/storage/buckets/${bucketId}/files/${fileId}/view?project=${
                    import.meta.env.VITE_APPWRITE_PROJECT_ID
                  }`;
                  setNewProduct({ ...newProduct, image: fileUrl });
                } catch (error) {
                  console.error("Error uploading image:", error);
                  alert("Failed to upload image. Please try again.");
                }
              }
            }}
            className="hidden"
            id="imageUpload"
          />
          <div
            className="w-full min-h-[200px] px-4 py-6 bg-[#1A1F2A] text-gray-400 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer hover:border-[#4169E1] hover:bg-[#1E2330] transition-all duration-300 relative"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.add("border-[#4169E1]");
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.remove("border-[#4169E1]");
            }}
            onDrop={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.remove("border-[#4169E1]");
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith("image/")) {
                try {
                  // Check for duplicate filename in storage
                  const fileList = await storage.listFiles(bucketId);
                  const isDuplicate = fileList.files.some(
                    (existingFile) => existingFile.name === file.name
                  );

                  if (isDuplicate) {
                    alert(
                      "A file with this name already exists. Please rename the file before uploading."
                    );
                    return;
                  }
                  // If there's an existing image, delete it first
                  if (newProduct.image) {
                    const oldFileId = newProduct.image
                      .split("/files/")[1]
                      .split("/view")[0];
                    try {
                      await storage.deleteFile(bucketId, oldFileId);
                    } catch (deleteError) {
                      console.error("Error deleting old image:", deleteError);
                    }
                  }
                  const fileId = ID.unique();
                  await storage.createFile(bucketId, fileId, file);
                  const fileUrl = `${
                    import.meta.env.VITE_APPWRITE_ENDPOINT
                  }/storage/buckets/${bucketId}/files/${fileId}/view?project=${
                    import.meta.env.VITE_APPWRITE_PROJECT_ID
                  }`;
                  setNewProduct({ ...newProduct, image: fileUrl });
                } catch (error) {
                  console.error("Error uploading image:", error);
                  alert("Failed to upload image. Please try again.");
                }
              } else {
                alert("Please upload an image file.");
              }
            }}
          >
            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center h-full cursor-pointer"
            >
              {newProduct.image ? (
                <div className="relative w-full h-full flex flex-col items-center">
                  <img
                    src={newProduct.image}
                    alt="Preview"
                    className="w-48 h-48 rounded-lg object-cover mb-2 hover:opacity-90 transition-opacity duration-300"
                  />
                  <p className="text-sm text-gray-400">
                    Click or drag to replace image
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <i className="fas fa-cloud-upload-alt text-4xl mb-4"></i>
                  <p className="text-lg mb-2">Drag and drop image here</p>
                  <p className="text-sm text-gray-500">
                    or click to select file
                  </p>
                </div>
              )}
            </label>
          </div>
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
            onClick={() => {
              if (
                !newProduct.name ||
                !newProduct.category ||
                !newProduct.style
              ) {
                alert(
                  "Please fill in all required fields (Name, Category, and Style)"
                );
                return;
              }
              handleAddProduct();
            }}
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
