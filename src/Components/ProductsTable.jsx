import React, { useState } from "react";
import TableHeader from "./shared/Table/TableHeader";
import ProductTableRow from "./Products/ProductTableRow";
import ProductModal from "./Products/ProductModal";
import Modal from "./shared/Modal";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../utils/appwriteService";

const ProductsTable = ({ initialProducts, categories, styles }) => {
  const [products, setProducts] = useState(initialProducts);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleAddProduct = async () => {
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = await updateProduct(
          editingProduct.id,
          newProduct
        );
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
        );
      } else {
        // Create new product
        const createdProduct = await createProduct(newProduct);
        setProducts([...products, createdProduct]);
      }
      setShowProductModal(false);
      setNewProduct({});
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      // You could add error handling UI here if needed
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
    } catch (error) {
      console.error("Error deleting product:", error);
      // You could add error handling UI here if needed
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowProductModal(true);
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
              {products.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </tbody>
          </table>
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
        </Modal>
      )}
    </>
  );
};

export default ProductsTable;
