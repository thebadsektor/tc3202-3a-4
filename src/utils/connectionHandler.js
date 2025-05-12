// Utility for handling internet connection status and session persistence

/**
 * Initializes the connection handler to maintain session during connectivity changes
 * This prevents the app from redirecting to login page when connection is restored
 */
export const initConnectionHandler = () => {
  // Store the current path when going offline
  const handleOffline = () => {
    // Only store path if not already on login page
    if (!window.location.pathname.includes('/login')) {
      sessionStorage.setItem('lastPath', window.location.pathname);
    }
  };

  // When coming back online, check if we need to restore session
  const handleOnline = () => {
    // Get stored auth token if it exists
    const authToken = localStorage.getItem('sb-auth-token');
    const lastPath = sessionStorage.getItem('lastPath');
    
    // If we have an auth token and a stored path, we should maintain the session
    // instead of redirecting to login
    if (authToken && lastPath) {
      // Clear the stored path as we're handling it now
      sessionStorage.removeItem('lastPath');
      
      // Prevent any automatic redirects to login page
      // by setting a flag that can be checked in auth logic
      sessionStorage.setItem('maintainSession', 'true');
      
      // Clear the flag after a short delay to allow auth checks to complete
      setTimeout(() => {
        sessionStorage.removeItem('maintainSession');
      }, 5000);
    }
  };

  // Add event listeners
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

/**
 * Checks if the session should be maintained during connectivity changes
 * @returns {boolean} True if session should be maintained
 */
export const shouldMaintainSession = () => {
  return sessionStorage.getItem('maintainSession') === 'true';
};