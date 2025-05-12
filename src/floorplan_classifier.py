import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image, ImageOps
import io
import cv2
import glob

class FloorplanClassifier:
    def __init__(self, img_size=(224, 224)):
        self.img_size = img_size
        self.model = None
        self.model_path = "src/models/keras_model.h5"  # Path to your Teachable Machine model
        self.labels_path = "src/models/labels.txt"     # Path to your labels file
        self.classes = []
        self.load_labels()
    
    def load_labels(self):
        """Load class labels from the labels.txt file"""
        try:
            if os.path.exists(self.labels_path):
                with open(self.labels_path, "r") as f:
                    self.classes = [line.strip() for line in f.readlines()]
                # Remove any index numbers if they're at the beginning of the labels
                self.classes = [label[2:] if label.startswith(str(i)) else label 
                               for i, label in enumerate(self.classes)]
                print(f"Loaded {len(self.classes)} classes: {self.classes}")
            else:
                print(f"Labels file not found at {self.labels_path}, using default classes")
                self.classes = ['irregular', 'rectangle', 'square']
        except Exception as e:
            print(f"Error loading labels: {str(e)}. Using default classes.")
            self.classes = ['irregular', 'rectangle', 'square']
    
    def load_model(self):
        """Load the trained Teachable Machine model from disk"""
        print(f"Loading model from {self.model_path}...")
        try:
            self.model = load_model(self.model_path, compile=False)
            print("Model loaded successfully")
            return self.model
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return None
    
    def preprocess_image(self, image):
        """Preprocess the image according to Teachable Machine requirements"""
        # Convert to RGB if needed
        if isinstance(image, np.ndarray):
            if len(image.shape) == 2 or (len(image.shape) == 3 and image.shape[2] == 1):
                # Convert grayscale to RGB
                pil_image = Image.fromarray(image).convert("RGB")
            else:
                pil_image = Image.fromarray(image)
        else:
            pil_image = image.convert("RGB")
        
        # Resize and crop from center
        resized_image = ImageOps.fit(pil_image, self.img_size, Image.Resampling.LANCZOS)
        
        # Convert to numpy array
        image_array = np.asarray(resized_image)
        
        # Normalize the image as required by Teachable Machine
        normalized_image = (image_array.astype(np.float32) / 127.5) - 1
        
        # Create the array of the right shape
        data = np.ndarray(shape=(1, self.img_size[0], self.img_size[1], 3), dtype=np.float32)
        data[0] = normalized_image
        
        return data
    
    def predict(self, image_data):
        """Predict the floorplan shape from image data"""
        if self.model is None:
            self.load_model()
            
        if self.model is None:
            return {"shape": "unknown", "confidence": 0.0}
        
        try:
            # Convert image data to PIL Image
            img = Image.open(io.BytesIO(image_data))
            
            # Preprocess the image
            preprocessed_img = self.preprocess_image(img)
            
            # Make prediction
            prediction = self.model.predict(preprocessed_img)
            
            # Get the predicted class index and confidence
            predicted_class_idx = np.argmax(prediction[0])
            confidence = float(prediction[0][predicted_class_idx])
            
            # Get the class name
            if predicted_class_idx < len(self.classes):
                predicted_class = self.classes[predicted_class_idx]
            else:
                predicted_class = f"unknown_class_{predicted_class_idx}"
            
            # Get confidences for all classes
            class_confidences = {cls: float(prediction[0][i]) 
                                for i, cls in enumerate(self.classes) 
                                if i < len(prediction[0])}
            
            # Consider low confidence if less than 0.6
            low_confidence = confidence < 0.6
            
            return {
                "shape": predicted_class,
                "confidence": confidence,
                "all_confidences": class_confidences,
                "low_confidence": low_confidence
            }
            
        except Exception as e:
            print(f"Error in prediction: {str(e)}")
            return {
                "shape": "error",
                "confidence": 0.0,
                "error": str(e)
            }

    # Include stubs for compatibility with existing code
    def build_model(self, model_type="teachable"):
        """Stub for compatibility with existing code"""
        print("Using pre-trained Teachable Machine model, no need to build")
        return self.load_model()
    
    def calculate_class_weights(self):
        """Stub for compatibility with existing code"""
        print("Using pre-trained Teachable Machine model, no need to calculate class weights")
        return {i: 1.0 for i in range(len(self.classes))}
    
    def load_and_preprocess_data(self):
        """Stub for compatibility with existing code"""
        print("Using pre-trained Teachable Machine model, no need to load training data")
        return None, None
    
    def train_model(self, train_generator=None, validation_generator=None, epochs=0):
        """Stub for compatibility with existing code"""
        print("Using pre-trained Teachable Machine model, no need to train")
        return None
    
    def save_model(self):
        """Stub for compatibility with existing code"""
        print("Using pre-trained Teachable Machine model, no need to save")
        return None
    
    def plot_training_history(self, history=None):
        """Stub for compatibility with existing code"""
        print("Using pre-trained Teachable Machine model, no training history to plot")
        return None

# Test the model if this script is run directly
if __name__ == "__main__":
    # Create model directory if it doesn't exist
    os.makedirs("src/models", exist_ok=True)
    
    # Initialize classifier
    classifier = FloorplanClassifier()
    
    # Load the model
    model = classifier.load_model()
    
    if model is not None:
        print("Model loaded successfully!")
        print(f"Available classes: {classifier.classes}")
        
        # Test the model on sample images if available
        try:
            test_image_path = "path/to/test/image.jpg"  # Replace with a test image path
            if os.path.exists(test_image_path):
                with open(test_image_path, "rb") as f:
                    image_data = f.read()
                
                result = classifier.predict(image_data)
                print(f"\nTest prediction result:")
                print(f"Predicted class: {result['shape']}")
                print(f"Confidence: {result['confidence']:.4f}")
                if 'all_confidences' in result:
                    print(f"All confidences: {result['all_confidences']}")
        except Exception as e:
            print(f"Error testing model: {str(e)}")
    else:
        print("Failed to load model")