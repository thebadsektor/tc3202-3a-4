from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import sys
import json
import io
import requests
import math
import re
from dotenv import load_dotenv
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.query import Query

# Load environment variables
load_dotenv()

# Add src directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.products_recommender import FurnitureRecommender
from src.floorplan_classifier import FloorplanClassifier

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the ML models
FURNITURE_MODEL_PATH = "src/models/furniture_recommender.h5"
FLOORPLAN_MODEL_PATH = "src/models/keras_model.h5"

try:
    recommender = FurnitureRecommender.load_model(FURNITURE_MODEL_PATH)
    # Initialize floorplan classifier (will be loaded when needed)
    floorplan_classifier = FloorplanClassifier()
    # Check if model exists, load it if available
    if os.path.exists(FLOORPLAN_MODEL_PATH):
        floorplan_classifier.load_model()
    else:
        print(f"Warning: Teachable Machine model not found at {FLOORPLAN_MODEL_PATH}")
except Exception as e:
    raise RuntimeError(f"Failed to load ML models: {e}")

# Add these models if you don't have them already
class RecommendationRequest(BaseModel):
    room: str
    style: str
    flooring: str
    refreshData: Optional[bool] = False

class Product(BaseModel):
    name: str
    category: str
    style: str
    image: str
    confidence: float
    recommendation_source: Optional[str] = "ml_model"

class RecommendationResponse(BaseModel):
    products: List[Product]

# Initialize Appwrite client
client = Client()
ENDPOINT = os.getenv('VITE_APPWRITE_ENDPOINT')
PROJECT_ID = os.getenv('VITE_APPWRITE_PROJECT_ID')
API_KEY = os.getenv('VITE_APPWRITE_API_KEY')

databases = Databases(client)
DATABASE_ID = os.getenv('VITE_APPWRITE_DATABASE_ID')
PRODUCTS_COLLECTION_ID = os.getenv('VITE_APPWRITE_PRODUCTS_COLLECTION_ID')

@app.get("/api/categories")
async def get_categories():
    """Get all available room categories"""
    categories = sorted(recommender.df['CATEGORY'].unique())
    return {"categories": categories}

@app.get("/api/styles")
async def get_styles():
    """Get all available styles"""
    styles = sorted(recommender.df['STYLE'].unique())
    return {"styles": styles}

@app.get("/api/flooring")
async def get_flooring_options():
    """Get all available flooring options"""
    flooring = recommender.get_flooring_options()
    return {"flooring": flooring}

# Modify your existing recommendation endpoint
@app.post("/api/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    try:
        # 1. Get ML-based recommendations from your existing model
        ml_recommendations = get_ml_recommendations(request.room, request.style, request.flooring)
        
        # 2. Get newly added products from Appwrite
        # Define a threshold date (e.g., products added in the last 30 days)
        threshold_date = datetime.now() - timedelta(days=30)
        
        # Get new products that match the user's preferences
        new_products = get_matching_products(
            room=request.room,
            style=request.style,
            flooring=request.flooring
        )
        
        # 3. Format new products to match ML recommendations format
        formatted_new_products = []
        for product in new_products:
            # Check if this product is already in ML recommendations
            if not any(ml_product["name"] == product["name"] for ml_product in ml_recommendations):
                formatted_product = {
                    "name": product["name"],
                    "category": product["category"],
                    "style": product["style"],
                    "image": product.get("image_url", product.get("imageUrl", "")),
                    "confidence": 90,  # High confidence for exact matches
                    "recommendation_source": "rule_based"
                }
                formatted_new_products.append(formatted_product)
        
        # 4. Add source flag to ML recommendations
        for product in ml_recommendations:
            product["recommendation_source"] = "ml_model"
        
        # 5. Combine recommendations (prioritize ML recommendations)
        combined_recommendations = ml_recommendations + formatted_new_products
        
        return {"products": combined_recommendations}
    
    except Exception as e:
        print(f"Error generating recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")

def get_matching_products(room: str, style: str, flooring: str) -> List[Dict[str, Any]]:
    """Get products from Appwrite that match the user's preferences"""
    try:
         # Corrected variable names
        database_id = DATABASE_ID
        products_collection_id = PRODUCTS_COLLECTION_ID
        
        # Query products that match the room and style
        result = databases.list_documents(
            database_id=database_id,
            collection_id=products_collection_id,
            queries=[
                Query.equal("category", room),
                Query.equal("style", style)
            ]
        )
        
        # Convert Appwrite response to list of products
        products = result.get("documents", [])
        
        # For flooring products, also include the selected flooring
        if flooring:
            flooring_result = databases.list_documents(
                database_id=database_id,
                collection_id=products_collection_id,
                queries=[
                    Query.equal("category", "Flooring"),
                    Query.equal("name", flooring)
                ]
            )
            flooring_products = flooring_result.get("documents", [])
            products.extend(flooring_products)
        
        return products
    
    except Exception as e:
        print(f"Error fetching products from Appwrite: {str(e)}")
        return []

# Keep your existing ML recommendation function
def get_ml_recommendations(room: str, style: str, flooring: str) -> List[Dict[str, Any]]:
    """Get recommendations from the ML model"""
    # Your existing ML recommendation logic
    # This function should return a list of product dictionaries
    try:
        # Load product data from your dataset
        with open("data/products.json", "r") as f:
            all_products = json.load(f)
        
        # Filter products based on room and style
        matching_products = [
            product for product in all_products
            if product["category"] == room and product["style"] == style
        ]
        
        # Add confidence scores
        for product in matching_products:
            product["confidence"] = 95  # High confidence for exact matches
        
        return matching_products
    except Exception as e:
        print(f"Error in ML recommendations: {str(e)}")
        return []

# New endpoint for floorplan classification
@app.post("/api/classify-floorplan")
async def classify_floorplan(file: UploadFile = File(...)):
    """Classify a floorplan image using the Teachable Machine model"""
    try:
        # Read the uploaded file
        contents = await file.read()
        
        # Ensure the floorplan model is loaded
        if floorplan_classifier.model is None:
            # Try to load the model (no need to train as we're using a pre-trained model)
            if not floorplan_classifier.load_model():
                raise HTTPException(
                    status_code=500, 
                    detail=f"Floorplan model not found at {FLOORPLAN_MODEL_PATH}. Please ensure the model file exists."
                )
        
        # Predict the floorplan shape
        result = floorplan_classifier.predict(contents)
        
        # Prepare response
        response = {
            "shape": result["shape"],
            "confidence": result["confidence"],
            "size": "Calculated from image"  # Size calculation is handled separately
        }
        
        # Add additional information if available
        if "all_confidences" in result:
            response["all_confidences"] = result["all_confidences"]
        if "low_confidence" in result:
            response["low_confidence"] = result["low_confidence"]
        if "error" in result:
            response["error"] = result["error"]
            
        return response
    
    except Exception as e:
        print(f"Error classifying floorplan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to classify floorplan: {str(e)}")

# New endpoint for generating quantity recommendations using Gemini API
class QuantityRequest(BaseModel):
    product_name: str
    room_size: str

class ProductInfoResponse(BaseModel):
    quantity: str
    size: str

@app.post("/api/generate-quantity/")
async def generate_quantity(request: QuantityRequest):
    """Generate quantity and size recommendation for a product using Gemini API"""
    try:
        # Get API key from environment variables
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Gemini API key not found in environment variables")
        
        # For flooring products, use fixed size of 0.093 sqm
        if request.product_name.lower().find("flooring") >= 0 or request.product_name.lower().find("tile") >= 0:
            # Calculate quantity based on room size
            size = float(request.room_size)
            sqFeet = size / 0.093
            tilesNeeded = math.ceil(sqFeet)
            return {"quantity": f"{tilesNeeded} pcs", "size": "0.093 sqm"}
        
        # Prepare the prompt for Gemini API for non-flooring products
        prompt = f"Given a room size of {request.room_size} square meters, and a recommended product named \"{request.product_name}\", I need two pieces of information:\n\n1. Suggest an appropriate quantity of that product to be placed in the room.\n2. Estimate the approximate size of this product in square meters (calculate as length x width).\n\nProvide your response in this exact format:\nQuantity: [number] pcs\nSize: [number] sqm\n\nEnsure the quantity makes sense for a typical room layout and the size is realistic for this type of product. Don't recommend the same values for every product."
        
        # Call Gemini API
        url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent"
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        }
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }
        
        response = requests.post(url, headers=headers, json=payload)
        
        # Check if the request was successful
        if response.status_code != 200:
            print(f"Gemini API error: {response.status_code} - {response.text}")
            return {"quantity": "1 pc", "size": "0.5 sqm"}  # Fallback values
        
        # Parse the response
        result = response.json()
        
        # Extract the generated text
        if "candidates" in result and len(result["candidates"]) > 0:
            candidate = result["candidates"][0]
            if "content" in candidate and "parts" in candidate["content"] and len(candidate["content"]["parts"]) > 0:
                response_text = candidate["content"]["parts"][0]["text"].strip()
                
                # Parse the response to extract quantity and size
                quantity = "1 pc"
                size = "0.5 sqm"
                
                # Look for quantity in the response
                quantity_match = re.search(r"Quantity:\s*([\d.]+)\s*(?:pc|pcs|piece|pieces|unit|units)", response_text, re.IGNORECASE)
                if quantity_match:
                    quantity = f"{quantity_match.group(1)} pcs"
                
                # Look for size in the response
                size_match = re.search(r"Size:\s*([\d.]+)\s*(?:sqm|sq m|square meter|square meters)", response_text, re.IGNORECASE)
                if size_match:
                    size = f"{size_match.group(1)} sqm"
                
                return {"quantity": quantity, "size": size}
        
        # If we couldn't extract the information, return fallback values
        return {"quantity": "1 pc", "size": "0.5 sqm"}
    
    except Exception as e:
        print(f"Error generating product information: {str(e)}")
        # Return fallback values in case of any error
        return {"quantity": "--", "size": "--"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)