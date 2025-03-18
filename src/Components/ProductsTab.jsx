import React, { useState } from "react";
import ProductsTable from "./ProductsTable";
import CategoriesTable from "./CategoriesTable";
import StylesTable from "./StylesTable";

const ProductsTab = () => {
  // Initial data
  const initialProducts = [
    {
      id: 1,
      name: "Modern Leather Sofa",
      category: "Living Room",
      style: "Modern",
      price: 1299.99,
      stock: 15,
      image:
        "https://public.readdy.ai/ai/img_res/6d2e11f8807b642eb490b91f4457bca4.jpg",
    },
    {
      id: 2,
      name: "Dining Table Set",
      category: "Dining Room",
      style: "Minimalist",
      price: 899.99,
      stock: 2,
      image:
        "https://public.readdy.ai/ai/img_res/e42ecb569c1a2428d5ad1d89e8a32972.jpg",
    },
  ];

  const initialCategories = [
    { id: 1, name: "Living Room" },
    { id: 2, name: "Kitchen" },
    { id: 3, name: "Bedroom" },
    { id: 4, name: "Office" },
  ];

  const initialStyles = [
    { id: 1, name: "Minimalist" },
    { id: 2, name: "Modern" },
    { id: 3, name: "Traditional" },
    { id: 4, name: "Industrial" },
  ];

  return (
    <div className="space-y-6">
      {/* Products Table Component */}
      <ProductsTable
        initialProducts={initialProducts}
        categories={initialCategories}
        styles={initialStyles}
      />

      {/* Categories Table Component */}
      <CategoriesTable initialCategories={initialCategories} />

      {/* Styles Table Component */}
      <StylesTable initialStyles={initialStyles} />
    </div>
  );
};

export default ProductsTab;
