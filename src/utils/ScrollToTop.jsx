import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component handles scrolling to top when navigation occurs
// It also handles scrolling to specific elements when hash fragments are present in the URL
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Scroll to a specific element with an offset to account for fixed headers
    const scrollWithOffset = (element, offset = 80) => {
      const yCoordinate = element.getBoundingClientRect().top + window.scrollY;
      const yOffset = -offset; // Adjust this offset to match your fixed header height
      window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
    };

    if (hash) {
      // Instantly scroll to the element if it exists
      const element = document.getElementById(hash.substring(1));
      if (element) {
        scrollWithOffset(element); // Scroll with offset for fixed header
      } else {
        // If element not found, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // If no hash, scroll to top instantly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]); // Re-run when pathname or hash changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;
