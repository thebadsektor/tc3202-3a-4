// Navigation control utility

export const preventBackNavigation = () => {
  // Immediately replace current state and add a new state to prevent back navigation
  window.history.replaceState(null, null, window.location.pathname);
  window.history.pushState(null, null, window.location.pathname);

  const handlePopState = (event) => {
    window.history.pushState(null, null, window.location.pathname);
  };

  window.addEventListener('popstate', handlePopState);

  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
};