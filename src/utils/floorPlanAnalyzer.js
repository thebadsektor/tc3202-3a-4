// Floor Plan Analyzer Utility
// Uses OpenCV.js for shape detection and size calculation

/**
 * Analyzes a floor plan image to detect shape and calculate size
 * @param {File} imageFile - The uploaded floor plan image file
 * @param {number} manualSize - Optional manual size input (in sqm)
 * @returns {Promise<{shape: string, size: string}>} - Detected shape and calculated size
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
    
    // Analyze largest contour
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
        shape: 'Unknown',
        size: manualSize ? `${manualSize} sqm` : 'Unable to calculate size'
      };
    }
    
    const largestContour = contours.get(maxContourIndex);
    const perimeter = cv.arcLength(largestContour, true);
    
    // Get the bounding rectangle first for aspect ratio analysis
    const boundingRect = cv.boundingRect(largestContour);
    const aspectRatio = boundingRect.width / boundingRect.height;
    
    // Approximate polygon with more relaxed threshold for better shape detection
    const approx = new cv.Mat();
    // Use a more adaptive epsilon value based on perimeter
    const epsilon = 0.04 * perimeter;
    cv.approxPolyDP(largestContour, approx, epsilon, true);
    
    // Determine shape based on multiple factors
    let shape;
    
    // First check if the overall shape is approximately square based on aspect ratio
    // Using a tighter range for better square detection
    const isOverallSquare = aspectRatio >= 0.85 && aspectRatio <= 1.15;
    
    // Check how well the contour fills the bounding rectangle
    const rectArea = boundingRect.width * boundingRect.height;
    const contourArea = cv.contourArea(largestContour);
    const areaRatio = contourArea / rectArea;
    
    // Detect L-shaped or irregular floor plans by checking if the area ratio is significantly lower
    // L-shaped floor plans typically have area ratios between 0.4 and 0.7
    const isLikelyIrregular = areaRatio < 0.75;
    
    // If the contour fills most of the bounding rectangle and aspect ratio is close to 1,
    // it's likely a square regardless of the number of vertices
    if (isOverallSquare && areaRatio > 0.85) {
      shape = 'Square';
    } 
    // If we have a reasonable number of vertices, analyze them in detail
    else if (approx.rows >= 4 && approx.rows <= 8) {
      // Extract vertices
      const vertices = [];
      for (let i = 0; i < approx.rows; i++) {
        vertices.push(new cv.Point(approx.data32S[i*2], approx.data32S[i*2+1]));
      }
      
      // Calculate all side lengths
      const distances = [];
      for (let i = 0; i < vertices.length; i++) {
        const next = (i + 1) % vertices.length;
        distances.push(
          Math.sqrt(Math.pow(vertices[i].x - vertices[next].x, 2) + 
                   Math.pow(vertices[i].y - vertices[next].y, 2))
        );
      }
      
      // Calculate angles between sides
      const angles = [];
      for (let i = 0; i < vertices.length; i++) {
        const prev = (i - 1 + vertices.length) % vertices.length;
        const next = (i + 1) % vertices.length;
        
        const v1 = {x: vertices[prev].x - vertices[i].x, y: vertices[prev].y - vertices[i].y};
        const v2 = {x: vertices[next].x - vertices[i].x, y: vertices[next].y - vertices[i].y};
        
        const dot = v1.x * v2.x + v1.y * v2.y;
        const det = v1.x * v2.y - v1.y * v2.x;
        const angle = Math.abs(Math.atan2(det, dot) * 180 / Math.PI);
        angles.push(angle > 180 ? 360 - angle : angle);
      }
      
      // Check if sides and angles are approximately right with more lenient thresholds
      const sideRatio = Math.max(...distances) / Math.min(...distances);
      const angleDeviation = angles.reduce((max, angle) => 
        Math.max(max, Math.abs(angle - 90)), 0);
      
      // Count how many angles are close to 90 degrees
      const rightAngles = angles.filter(angle => Math.abs(angle - 90) < 25).length;
      
      // Check for concave shapes (like L-shapes) which are irregular
      // Calculate convex hull area and compare with contour area
      const hull = new cv.Mat();
      cv.convexHull(largestContour, hull, false, true);
      const hullArea = cv.contourArea(hull);
      const convexityRatio = contourArea / hullArea;
      hull.delete();
      
      // L-shaped or other concave shapes will have a convexity ratio significantly less than 1
      const isConcave = convexityRatio < 0.85;
      
      // If the shape is likely irregular (L-shaped or other concave shape)
      if (isLikelyIrregular || isConcave) {
        shape = 'Irregular';
      }
      // More lenient thresholds for square/rectangle detection
      else if ((sideRatio < 2.5 && angleDeviation < 35) || rightAngles >= 4) {
        // For square detection, use a more lenient threshold on aspect ratio
        if (sideRatio < 1.5 && isOverallSquare) {
          shape = 'Square';
        } else {
          // Additional check: if the aspect ratio is very close to 1, it's likely a square
          // even if the sides aren't perfectly equal
          if (aspectRatio >= 0.9 && aspectRatio <= 1.1) {
            shape = 'Square';
          } else {
            shape = 'Rectangle';
          }
        }
      } else {
        // If the overall shape is still very square-like despite not meeting angle criteria
        if (isOverallSquare && areaRatio > 0.75) {
          shape = 'Square';
        } else {
          shape = 'Irregular';
        }
      }
    } 
    // For shapes with many vertices, rely more on the bounding rectangle
    else {
      // Check for concave shapes (like L-shapes) which are irregular
      const hull = new cv.Mat();
      cv.convexHull(largestContour, hull, false, true);
      const hullArea = cv.contourArea(hull);
      const convexityRatio = contourArea / hullArea;
      hull.delete();
      
      // L-shaped or other concave shapes will have a convexity ratio significantly less than 1
      const isConcave = convexityRatio < 0.85;
      
      // If the shape is likely irregular (L-shaped or other concave shape)
      if (isLikelyIrregular || isConcave) {
        shape = 'Irregular';
      }
      // For textured floor plans that generate many vertices
      else if (isOverallSquare && areaRatio > 0.75) {
        shape = 'Square';
      } 
      // Only classify as Rectangle if it's very clearly rectangular and not irregular
      else if (areaRatio > 0.8 && !isLikelyIrregular && !isConcave) {
        // Using tighter aspect ratio range for square detection
        shape = aspectRatio >= 0.9 && aspectRatio <= 1.1 ? 'Square' : 'Rectangle';
      } else {
        // Default to Irregular for any other cases
        shape = 'Irregular';
      }
    }
    
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
      
      // For rectangles, also calculate dimensions
      if (shape === 'Rectangle' || shape === 'Square') {
        const vertices = [];
        for (let i = 0; i < approx.rows; i++) {
          vertices.push(new cv.Point(approx.data32S[i*2], approx.data32S[i*2+1]));
        }
        
        const widthPx = Math.sqrt(
          Math.pow(vertices[0].x - vertices[1].x, 2) + 
          Math.pow(vertices[0].y - vertices[1].y, 2)
        );
        
        const heightPx = Math.sqrt(
          Math.pow(vertices[1].x - vertices[2].x, 2) + 
          Math.pow(vertices[1].y - vertices[2].y, 2)
        );
        
        const width = Math.round(widthPx / scale);
        const height = Math.round(heightPx / scale);
        
        sizeText = `${realArea.toFixed(0)} sqm or ${width}x${height} sqm`;
      } else {
        sizeText = `${realArea.toFixed(0)} sqm`;
      }
    }
    
    return {
      shape,
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