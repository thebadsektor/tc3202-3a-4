// Floor Plan Analyzer Utility
// Uses OpenCV.js for dimension calculation only

/**
 * Analyzes a floor plan image to calculate dimensions and size
 * @param {File} imageFile - The uploaded floor plan image file
 * @param {number} manualSize - Optional manual size input (in sqm)
 * @returns {Promise<{size: string}>} - Calculated size of the floor plan
 */
export async function analyzeFloorPlan(imageFile, manualSize = null) {
  // Load OpenCV.js if not already loaded
  if (!window.cv) {
    await loadOpenCV();
  }

  // Convert File to HTMLImageElement
  const img = await createImageBitmap(imageFile);
  
  // Create canvas and draw image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);

  // Convert to OpenCV Mat
  const src = cv.imread(canvas);
  const dst = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  
  try {
    // Enhanced preprocessing for better handling of textured floor plans
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
    
    // Apply stronger Gaussian blur to reduce noise and texture details
    const ksize = new cv.Size(7, 7);
    cv.GaussianBlur(src, src, ksize, 0);
    
    // Use adaptive thresholding for better edge detection in varied lighting
    const blockSize = Math.max(7, Math.round(Math.min(src.rows, src.cols) / 50));
    cv.adaptiveThreshold(src, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, blockSize * 2 + 1, 2);
    
    // Apply morphological operations to clean up the image
    const kernel = cv.Mat.ones(3, 3, cv.CV_8U);
    cv.morphologyEx(dst, dst, cv.MORPH_CLOSE, kernel);
    kernel.delete();
    
    // Find contours
    cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
    // Find largest contour
    let maxArea = 0;
    let maxContourIndex = -1;
    
    for (let i = 0; i < contours.size(); ++i) {
      const contour = contours.get(i);
      const area = cv.contourArea(contour);
      
      if (area > maxArea) {
        maxArea = area;
        maxContourIndex = i;
      }
    }
    
    if (maxContourIndex === -1) {
      return {
        size: manualSize ? `${manualSize} sqm` : 'Unable to calculate size'
      };
    }
    
    const largestContour = contours.get(maxContourIndex);
    const perimeter = cv.arcLength(largestContour, true);
    
    // Get the bounding rectangle for dimension analysis
    const boundingRect = cv.boundingRect(largestContour);
    
    // Approximate polygon for more accurate dimension calculation
    const approx = new cv.Mat();
    const epsilon = 0.04 * perimeter;
    cv.approxPolyDP(largestContour, approx, epsilon, true);
    
    // Calculate size
    let sizeText;
    if (manualSize) {
      sizeText = `${manualSize} sqm`;
    } else {
      // Calculate area in pixels
      const pixelArea = cv.contourArea(largestContour);
      
      // For demo purposes, we'll assume 100px = 1m
      // In a real app, you'd need a scale reference from the user
      const scale = 100; // pixels per meter
      const realArea = pixelArea / (scale * scale);
      
      // Calculate dimensions based on bounding rectangle
      const widthPx = boundingRect.width;
      const heightPx = boundingRect.height;
      
      const width = Math.round(widthPx / scale);
      const height = Math.round(heightPx / scale);
      
      sizeText = `${realArea.toFixed(0)} sqm or ${width}x${height} sqm`;
    }
    
    // Clean up approx matrix
    approx.delete();
    
    return {
      size: sizeText
    };
    
  } finally {
    // Clean up
    src.delete();
    dst.delete();
    contours.delete();
    hierarchy.delete();
  }
}

/**
 * Loads OpenCV.js library dynamically
 */
async function loadOpenCV() {
  return new Promise((resolve, reject) => {
    if (window.cv) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.5.5/opencv.js';
    script.async = true;
    script.onload = () => {
      // Wait for OpenCV to be ready
      const checkReady = setInterval(() => {
        if (window.cv && window.cv.getBuildInformation) {
          clearInterval(checkReady);
          resolve();
        }
      }, 100);
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
}