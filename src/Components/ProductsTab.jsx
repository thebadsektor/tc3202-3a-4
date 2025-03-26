import React, { useState, useEffect } from "react";
import ProductsTable from "./ProductsTable";
import CategoriesTable from "./CategoriesTable";
import StylesTable from "./StylesTable";
import SkeletonLoading from "./shared/SkeletonLoading";
import {
  getProducts,
  getCategories,
  getStyles,
} from "../utils/appwriteService";

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch data from Appwrite
        const productsData = await getProducts();
        const categoriesData = await getCategories();
        const stylesData = await getStyles();

        // Update state with fetched data
        setProducts(productsData);
        setCategories(categoriesData);
        setStyles(stylesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        // Use fallback data if fetch fails
        setProducts([
          {
            id: "1",
            name: "Modern Leather Sofa",
            category: "Living Room",
            style: "Modern",

            image:
              "https://public.readdy.ai/ai/img_res/6d2e11f8807b642eb490b91f4457bca4.jpg",
          },
          {
            id: "2",
            name: "Dining Table Set",
            category: "Dining Room",
            style: "Minimalist",

            image:
              "https://public.readdy.ai/ai/img_res/e42ecb569c1a2428d5ad1d89e8a32972.jpg",
          },
        ]);
        setCategories([
          { id: "1", name: "Living Room" },
          { id: "2", name: "Kitchen" },
          { id: "3", name: "Bedroom" },
          { id: "4", name: "Office" },
        ]);
        setStyles([
          { id: "1", name: "Minimalist" },
          { id: "2", name: "Modern" },
          { id: "3", name: "Traditional" },
          { id: "4", name: "Industrial" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <SkeletonLoading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Functions to update state when categories or styles change
  const updateCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error updating categories:", err);
    }
  };

  const updateStyles = async () => {
    try {
      const stylesData = await getStyles();
      setStyles(stylesData);
    } catch (err) {
      console.error("Error updating styles:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Products Table Component */}
      <ProductsTable
        initialProducts={products}
        categories={categories}
        styles={styles}
      />

      {/* Categories Table Component */}
      <CategoriesTable
        initialCategories={categories}
        onCategoryUpdate={updateCategories}
      />

      {/* Styles Table Component */}
      <StylesTable initialStyles={styles} onStyleUpdate={updateStyles} />
    </div>
  );
};

export default ProductsTab;
