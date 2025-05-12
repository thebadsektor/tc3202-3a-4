import React, { useState, useEffect } from "react";
import Toast from "./Toast";
import { initConnectionHandler } from "../../utils/connectionHandler";

const ConnectionHandler = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Initial check
    setIsOnline(navigator.onLine);
    setShowOfflineToast(!navigator.onLine);
    if (!navigator.onLine) {
      setWasOffline(true);
    }

    // Event handlers for online/offline status changes
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineToast(false);
      
      // Only show online toast if we were previously offline
      if (wasOffline) {
        setShowOnlineToast(true);
        
        // Auto-dismiss the online toast after 5 seconds
        setTimeout(() => {
          dismissOnlineToast();
        }, 5000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineToast(true);
      setWasOffline(true);
    };

    // Add event listeners for UI updates
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    // Initialize connection handler for session persistence
    const cleanupConnectionHandler = initConnectionHandler();

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      cleanupConnectionHandler();
    };
  }, [wasOffline]);

  const dismissOnlineToast = () => {
    setShowOnlineToast(false);
    setWasOffline(false);
  };

  return (
    <>
      <Toast
        showToast={showOfflineToast}
        toastMessage={"No internet connection. Please try again."}
        toastType="error"
      />
      <Toast
        showToast={showOnlineToast}
        toastMessage={"Internet connection restored."}
        toastType="success"
        duration={1000}
        onDismiss={dismissOnlineToast}
      />
    </>
  );
};

export default ConnectionHandler;