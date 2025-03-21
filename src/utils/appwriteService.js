import { ID } from 'appwrite';
import { databases, storage, bucketId } from './appwriteConfig';

// Use environment variables for database and collection IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '67da95880020fbe64129';
const PRODUCTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID || '67da95ab0039adf29049';
const CATEGORIES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID || '67da96cf00160a1d35f0';
const STYLES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_STYLES_COLLECTION_ID || '67da97d300202d3581d4';

// Products CRUD operations
export const getProducts = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID
    );
    
    // Map Appwrite data to match the system's format
    return response.documents.map(doc => ({
      id: doc.$id,
      name: doc.PRODUCT_NAME, // Map PRODUCT_NAME to name for display
      category: doc.CATEGORY,
      style: doc.STYLE,

      image: doc.IMAGE || ''
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const createProduct = async (productData) => {
  try {
    // Validate required fields
    if (!productData.name || !productData.category || !productData.style) {
      throw new Error('Missing required fields');
    }

    // Map system data to Appwrite format and ensure all fields are properly formatted
    const appwriteData = {
      PRODUCT_NAME: productData.name.trim(),
      CATEGORY: productData.category.trim(),
      STYLE: productData.style.trim(),
      IMAGE: productData.image ? productData.image.trim() : ''
    }

    const response = await databases.createDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      ID.unique(),
      appwriteData
    );

    return {
      id: response.$id,
      name: response.PRODUCT_NAME,
      category: response.CATEGORY,
      style: response.STYLE,

      image: response.IMAGE || ''
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    // Validate required fields
    if (!productData.name || !productData.category || !productData.style) {
      throw new Error('Missing required fields');
    }

    // Map system data to Appwrite format and ensure all fields are properly formatted
    const appwriteData = {
      PRODUCT_NAME: productData.name.trim(),
      CATEGORY: productData.category.trim(),
      STYLE: productData.style.trim(),
      IMAGE: productData.image ? productData.image.trim() : ''
    }

    const response = await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      id,
      appwriteData
    );

    return {
      id: response.$id,
      name: response.PRODUCT_NAME,
      category: response.CATEGORY,
      style: response.STYLE,

      image: response.IMAGE || ''
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    // Get the product first to access its image URL
    const product = await databases.getDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      id
    );

    // If product has an image, delete it from storage
    if (product.IMAGE) {
      try {
        // Extract file ID from the image URL
        const fileId = product.IMAGE.split('/files/')[1].split('/view')[0];
        // Delete the image file from storage
        await storage.deleteFile(bucketId, fileId);
        console.log('Successfully deleted image file from storage');
      } catch (deleteError) {
        console.error('Error deleting image file from storage:', deleteError);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete the product document
    await databases.deleteDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      id
    );
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Categories CRUD operations
export const getCategories = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      CATEGORIES_COLLECTION_ID
    );
    
    return response.documents.map(doc => ({
      id: doc.$id,
      name: doc.NAME
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createCategory = async (name) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      CATEGORIES_COLLECTION_ID,
      ID.unique(),
      { NAME: name }
    );

    return {
      id: response.$id,
      name: response.NAME
    };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id, name) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      CATEGORIES_COLLECTION_ID,
      id,
      { NAME: name }
    );

    return {
      id: response.$id,
      name: response.NAME
    };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      CATEGORIES_COLLECTION_ID,
      id
    );
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Styles CRUD operations
export const getStyles = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      STYLES_COLLECTION_ID
    );
    
    return response.documents.map(doc => ({
      id: doc.$id,
      name: doc.NAME
    }));
  } catch (error) {
    console.error('Error fetching styles:', error);
    return [];
  }
};

export const createStyle = async (name) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      STYLES_COLLECTION_ID,
      ID.unique(),
      { NAME: name }
    );

    return {
      id: response.$id,
      name: response.NAME
    };
  } catch (error) {
    console.error('Error creating style:', error);
    throw error;
  }
};

export const updateStyle = async (id, name) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      STYLES_COLLECTION_ID,
      id,
      { NAME: name }
    );

    return {
      id: response.$id,
      name: response.NAME
    };
  } catch (error) {
    console.error('Error updating style:', error);
    throw error;
  }
};

export const deleteStyle = async (id) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      STYLES_COLLECTION_ID,
      id
    );
    return true;
  } catch (error) {
    console.error('Error deleting style:', error);
    throw error;
  }
};