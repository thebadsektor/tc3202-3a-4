import pandas as pd
import numpy as np
import h5py
import joblib
import os
import re
import tensorflow as tf

def get_direct_image_link(file_id):
    """Generate direct image link from Appwrite file ID"""
    return f"https://cloud.appwrite.io/v1/storage/buckets/{BUCKET_ID}/files/{file_id}/view?project={PROJECT_ID}"
from tensorflow import keras
from tensorflow.keras import layers, Model
from tensorflow.keras.models import load_model
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from typing import List, Dict, Any, Optional
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.id import ID
from appwrite.query import Query

# Appwrite configuration
ENDPOINT = 'https://cloud.appwrite.io/v1'
PROJECT_ID = '67da93a8003a50004c86'
DATABASE_ID = '67da95880020fbe64129'
PRODUCTS_COLLECTION_ID = '67da95ab0039adf29049'
BUCKET_ID = '67da9823002456d7c1a2'
API_KEY = 'standard_b51564fda1e74168a1c843ae84eb92ff7dacfc4e78cb619b269fbd0051cceeb7d24ad1a16b303a42a5a062f29deea6b8530b6792f5f3b715f23e3a5d5bb5ba4cd7cef8afe15255f40c710c995139a060e05eff3e61928d89abc35fa56112e94c97b7ff1ee156046a1267a9f74a24bae62414d94dc12fe4fe6f792b1aafeedbc8'

class FurnitureRecommender:
    def __init__(self, embedding_dim=64, n_neighbors=10):
        self.n_neighbors = n_neighbors
        self.embedding_dim = embedding_dim
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.one_hot_encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
        self.scaler = StandardScaler()
        self.model = None
        self.encoder_model = None
        self.df = None
        self.features = None
        self.feature_dim = None
        
    def _init_appwrite_client(self):
        """Initialize Appwrite client"""
        client = Client()
        client.set_endpoint(ENDPOINT)
        client.set_project(PROJECT_ID)
        client.set_key(API_KEY)
        return client

    def _fetch_appwrite_data(self):
        """Fetch data from Appwrite database"""
        client = self._init_appwrite_client()
        database = Databases(client)
        storage = Storage(client)
        
        # Fetch products
        response = database.list_documents(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            [Query.limit(1000)]
        )
        
        # Convert to DataFrame
        products = []
        for doc in response['documents']:
            products.append({
                'PRODUCT_NAME': doc['PRODUCT_NAME'],
                'CATEGORY': doc['CATEGORY'],
                'STYLE': doc['STYLE'],
                'IMAGE_URL': doc['IMAGE'],
                'file_id': doc['$id']
            })
        
        return pd.DataFrame(products)

    def preprocess_data(self):
        """Preprocess the dataset"""
        # Always fetch data from Appwrite
        self.df = self._fetch_appwrite_data()
        
        # Create document representations combining category, style and product name
        self.df['text_features'] = (
            self.df['CATEGORY'] + ' ' + 
            self.df['STYLE'] + ' ' + 
            self.df['PRODUCT_NAME']
        )
        
        return self.df
    
    def build_features(self, df):
        """Build feature matrix from dataframe"""
        # Text features using TF-IDF
        text_features = self.vectorizer.fit_transform(df['text_features'])
        
        # Categorical features using OneHotEncoder
        cat_features = self.one_hot_encoder.fit_transform(
            df[['CATEGORY', 'STYLE']]
        )
        
        # Combine features
        combined_features = np.hstack([
            text_features.toarray(),
            cat_features
        ])
        
        # Scale features
        scaled_features = self.scaler.fit_transform(combined_features)
        
        self.features = scaled_features
        self.feature_dim = scaled_features.shape[1]
        return scaled_features
    
    def _build_encoder_model(self):
        """Build the encoder part of the model that maps input features to embeddings"""
        input_layer = layers.Input(shape=(self.feature_dim,))
        x = layers.Dense(128, activation='relu')(input_layer)
        x = layers.Dropout(0.2)(x)
        embedding = layers.Dense(self.embedding_dim, activation='relu', name='embedding')(x)
        
        # Create encoder model
        encoder = Model(inputs=input_layer, outputs=embedding, name='encoder')
        return encoder
    
    def _build_full_model(self, encoder):
        """Build the full autoencoder model for training"""
        embedding = encoder.output
        
        # Decoder part
        x = layers.Dense(128, activation='relu')(embedding)
        x = layers.Dropout(0.2)(x)
        output_layer = layers.Dense(self.feature_dim)(x)
        
        # Full model
        full_model = Model(inputs=encoder.input, outputs=output_layer, name='furniture_recommender')
        full_model.compile(
            optimizer='adam',
            loss='mse'
        )
        
        return full_model
        
    def train(self, epochs=50, batch_size=32, verbose=1):
        """Train the recommendation model"""
        # Preprocess data
        df = self.preprocess_data()
        
        # Build features
        features = self.build_features(df)
        
        # Build encoder model
        self.encoder_model = self._build_encoder_model()
        
        # Build and train full model
        full_model = self._build_full_model(self.encoder_model)
        
        # Train autoencoder
        history = full_model.fit(
            features, features,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=0.2,
            verbose=verbose
        )
        
        # Store the model for inference
        self.model = full_model
        
        print(f"Model trained successfully with {features.shape[1]} features")
        return self
    
    def get_flooring_options(self):
        """Get all available flooring products"""
        if self.df is None:
            raise ValueError("Model not trained. Please train the model first.")
            
        flooring_products = self.df[self.df['CATEGORY'] == 'Flooring']['PRODUCT_NAME'].unique()
        return sorted(flooring_products)
    
    def _compute_embeddings(self, features):
        """Compute embeddings using the encoder part of the model"""
        # Get the encoder part of the model
        if hasattr(self.model, 'get_layer'):
            encoder_layer = self.model.get_layer('encoder')
            embedding_layer = encoder_layer.get_layer('embedding')
            
            # Define a function to get embeddings
            embedding_function = tf.keras.backend.function(
                [encoder_layer.input], 
                [embedding_layer.output]
            )
            
            # Get embeddings
            embeddings = embedding_function([features])[0]
            return embeddings
        else:
            # If we loaded the encoder model directly
            return self.encoder_model.predict(features)
    
    def _cosine_similarity(self, a, b):
        """Calculate cosine similarity between two vectors or a vector and a matrix"""
        # Normalize vectors
        a_norm = tf.nn.l2_normalize(a, axis=1)
        b_norm = tf.nn.l2_normalize(b, axis=1)
        
        # Calculate similarity
        similarity = tf.matmul(a_norm, b_norm, transpose_b=True)
        return similarity.numpy()
    
    def get_recommendations(self, category, style, flooring=None, top_n=10):
        """Get recommendations based on category, style, and optional flooring"""
        # Create a filtered dataframe that will hold our results
        results = []
        
        # Step 1: If flooring is specified, always include it in the results
        if flooring and flooring != "":
            flooring_items = self.df[self.df['PRODUCT_NAME'] == flooring]
            if not flooring_items.empty:
                # Add the flooring item with 100% confidence
                flooring_df = flooring_items.copy()
                flooring_df['confidence'] = 100.0
                results.append(flooring_df)
        
        # Step 2: Get products that match the category and style
        # (excluding any flooring products unless they were specifically requested)
        filtered_df = self.df.copy()
        
        # If a specific flooring was requested, we'll exclude other flooring products
        if flooring and flooring != "":
            # Filter out flooring products except the requested one
            filtered_df = filtered_df[
                (filtered_df['CATEGORY'] != 'Flooring') | 
                (filtered_df['PRODUCT_NAME'] == flooring)
            ]
        
        # Now filter by category and style
        category_style_df = filtered_df[
            (filtered_df['CATEGORY'] == category) & 
            (filtered_df['STYLE'] == style)
        ]
        
        if not category_style_df.empty:
            # Add confidence score of 100% for exact matches
            category_style_df = category_style_df.copy()
            category_style_df['confidence'] = 100.0
            results.append(category_style_df)
        else:
            # Fallback: Look for products with matching category
            category_matches = filtered_df[filtered_df['CATEGORY'] == category].copy()
            
            if not category_matches.empty:
                # Create query features for the style
                query_text = f"{style}"
                query_text_features = self.vectorizer.transform([query_text])
                
                # Get text features for category matches
                category_text_features = self.vectorizer.transform(category_matches['STYLE'])
                
                # Calculate similarities using dot product (similar to cosine similarity)
                query_vec = query_text_features.toarray()[0]
                similarities = np.array([
                    np.dot(query_vec, cat_vec) / (np.linalg.norm(query_vec) * np.linalg.norm(cat_vec) + 1e-8)
                    for cat_vec in category_text_features.toarray()
                ])
                
                # Add similarities as confidence scores
                category_matches['confidence'] = (similarities * 80).round(2)  # Max 80% for category matches
                results.append(category_matches.sort_values('confidence', ascending=False))
        
        # Combine results if we have multiple dataframes
        if results:
            combined_results = pd.concat(results).drop_duplicates(subset=['PRODUCT_NAME'])
            return combined_results.sort_values('confidence', ascending=False).head(top_n)
        else:
            # Ultimate fallback: Use neural embeddings approach
            query_text = f"{category} {style}"
            
            # Transform query using the same transformation as training data
            query_text_features = self.vectorizer.transform([query_text])
            
            # Create categorical features for the query
            query_cat_features = self.one_hot_encoder.transform(
                pd.DataFrame([[category, style]], columns=['CATEGORY', 'STYLE'])
            )
            
            # Combine query features
            combined_query_features = np.hstack([
                query_text_features.toarray(),
                query_cat_features
            ])
            
            # Scale features
            scaled_query_features = self.scaler.transform(combined_query_features)
            
            # Get embeddings for query and all items
            query_embedding = self._compute_embeddings(scaled_query_features)
            all_embeddings = self._compute_embeddings(self.features)
            
            # Calculate similarity
            similarities = self._cosine_similarity(query_embedding, all_embeddings)[0]
            
            # Get indices of top N similar items
            top_indices = np.argsort(similarities)[::-1][:top_n]
            
            # Prepare results
            result_df = self.df.iloc[top_indices].copy()
            
            # Convert similarities to confidence scores
            result_df['confidence'] = (similarities[top_indices] * 50).round(2)  # Max 50% for fallback
            
            return result_df.sort_values('confidence', ascending=False).head(top_n)
    
    def save_model(self, path='src/models'):
        """Save the trained model to disk using h5 format"""
        # Create directory if it doesn't exist
        os.makedirs(path, exist_ok=True)
        model_path = f"{path}/furniture_recommender.h5"
        
        # Create a placeholder attribute directory for non-TF components
        attrs_dir = os.path.join(path, "attrs")
        os.makedirs(attrs_dir, exist_ok=True)
        
        # Save TF-independent components
        vectorizer_path = os.path.join(attrs_dir, "vectorizer.joblib")
        encoder_path = os.path.join(attrs_dir, "encoder.joblib")
        scaler_path = os.path.join(attrs_dir, "scaler.joblib")
        df_path = os.path.join(attrs_dir, "dataframe.joblib")
        
        joblib.dump(self.vectorizer, vectorizer_path)
        joblib.dump(self.one_hot_encoder, encoder_path)
        joblib.dump(self.scaler, scaler_path)
        joblib.dump(self.df, df_path)
        
        # Save the encoder model (containing the embedding layer)
        self.encoder_model.save(model_path)
        
        # Add custom attributes to the h5 file
        with h5py.File(model_path, 'a') as h5file:
            # Add metadata as attributes
            h5file.attrs['vectorizer_path'] = vectorizer_path
            h5file.attrs['encoder_path'] = encoder_path
            h5file.attrs['scaler_path'] = scaler_path
            h5file.attrs['df_path'] = df_path
            h5file.attrs['n_neighbors'] = self.n_neighbors
            h5file.attrs['embedding_dim'] = self.embedding_dim
            h5file.attrs['feature_dim'] = self.feature_dim
            
            # Create a metadata group
            if 'metadata' not in h5file:
                metadata = h5file.create_group('metadata')
                metadata.attrs['version'] = np.array([1, 0, 0])
            
        print(f"Model saved to {model_path}")
        return model_path
    
    @classmethod
    def load_model(cls, path='models/furniture_recommender.h5'):
        """Load a trained model from disk using h5 format"""
        try:
            # Load the keras model first
            encoder_model = load_model(path)
            
            # Extract custom attributes from the h5 file
            with h5py.File(path, 'r') as h5file:
                vectorizer_path = h5file.attrs['vectorizer_path']
                encoder_path = h5file.attrs['encoder_path']
                scaler_path = h5file.attrs['scaler_path']
                df_path = h5file.attrs['df_path']
                n_neighbors = h5file.attrs['n_neighbors']
                embedding_dim = h5file.attrs['embedding_dim']
                feature_dim = h5file.attrs['feature_dim']
            
            # Load components using joblib
            vectorizer = joblib.load(vectorizer_path)
            one_hot_encoder = joblib.load(encoder_path)
            scaler = joblib.load(scaler_path)
            df = joblib.load(df_path)
            
            # Create a new instance
            recommender = cls(embedding_dim=embedding_dim, n_neighbors=n_neighbors)
            
            # Restore the model components
            recommender.vectorizer = vectorizer
            recommender.one_hot_encoder = one_hot_encoder
            recommender.scaler = scaler
            recommender.encoder_model = encoder_model
            recommender.model = encoder_model  # Use the encoder model as the main model
            recommender.df = df
            recommender.feature_dim = feature_dim
            
            print(f"Model loaded from {path}")
            return recommender
            
        except Exception as e:
            # If loading with h5 fails (e.g., old format), try loading with legacy loader
            if os.path.exists(path.replace('.h5', '.pkl')):
                legacy_path = path.replace('.h5', '.pkl')
                print(f"Attempting to load legacy pickle model from {legacy_path}")
                
                # Use the legacy loader
                try:
                    with open(legacy_path, 'rb') as f:
                        model_data = joblib.load(f)
                    
                    # Create a new instance
                    recommender = cls()
                    
                    # Restore the model components
                    recommender.vectorizer = model_data['vectorizer']
                    recommender.one_hot_encoder = model_data['one_hot_encoder']
                    recommender.df = model_data['df']
                    
                    print(f"Legacy model loaded from {legacy_path} (requires conversion)")
                    
                    # Convert the legacy model to a new TF one
                    # We'll need to build features and train a minimal model
                    features = recommender.build_features(recommender.df)
                    recommender.encoder_model = recommender._build_encoder_model()
                    full_model = recommender._build_full_model(recommender.encoder_model)
                    recommender.model = full_model
                    
                    # Quick training to initialize weights (not optimal but should work)
                    recommender.model.fit(features, features, epochs=1, verbose=0)
                    
                    # Save the converted model in the new format
                    recommender.save_model(os.path.dirname(path))
                    
                    return recommender
                except Exception as le:
                    print(f"Legacy conversion failed: {le}")
                    
            # If all else fails, raise error
            raise ValueError(f"Error loading model: {e}")


def train_and_save_model():
    """Train model using Appwrite data and save it"""
    # Create and train model
    recommender = FurnitureRecommender(embedding_dim=64, n_neighbors=5)
    recommender.train(epochs=30, batch_size=32)
    
    # Save the model
    model_path = recommender.save_model()
    
    return model_path


if __name__ == '__main__':
    # This will train and save the model when the script is run directly
    model_path = train_and_save_model()
    print(f"Model saved to: {model_path}")
    
    # Test model loading and recommendations
    recommender = FurnitureRecommender.load_model(model_path)
    
    # Get unique categories and styles
    categories = sorted(recommender.df['CATEGORY'].unique())
    styles = sorted(recommender.df['STYLE'].unique())
    flooring_options = recommender.get_flooring_options()
    
    print("\nAvailable Categories:", categories)
    print("Available Styles:", styles)
    print("Available Flooring Options:", flooring_options)
    
    # Test recommendation
    test_category = "Kitchen"
    test_style = "Modern"
    test_flooring = "Matte Porcelain Tiles"
    
    print(f"\nTest Recommendations for {test_category} - {test_style} with {test_flooring} flooring:")
    recommendations = recommender.get_recommendations(test_category, test_style, test_flooring)
    
    for _, product in recommendations.iterrows():
        print(f"- {product['PRODUCT_NAME']} (Confidence: {product['confidence']}%)")