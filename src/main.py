from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import sys

# Add src directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from products_recommender import FurnitureRecommender

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the ML model
MODEL_PATH = "src/models/furniture_recommender.h5"
try:
    recommender = FurnitureRecommender.load_model(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load ML model: {e}")

class RecommendationRequest(BaseModel):
    room: str
    style: str
    flooring: Optional[str] = None

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

@app.post("/api/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """
    Get product recommendations based on user selections
    Returns:
        List of recommended products with image URLs and confidence scores
    """
    try:
        recommendations = recommender.get_recommendations(
            category=request.room,
            style=request.style,
            flooring=request.flooring
        )
        
        # Format response for frontend to match UserPage.jsx expectations
        products = []
        for _, row in recommendations.iterrows():
            products.append({
                "id": str(row.name),  # Unique identifier
                "name": row['PRODUCT_NAME'],
                "image": row['IMAGE_URL'],  # Changed from image_url to image
                "category": row['CATEGORY'],
                "style": row['STYLE'],
                "description": row.get('DESCRIPTION', '')
            })
        
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)