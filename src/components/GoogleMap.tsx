"use client"
import React, { useEffect, useRef } from 'react';

const GoogleMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      // Check if the Google Maps API is already loaded
      if (window.google && window.google.maps) {
        // Google Maps API is already loaded, proceed to initialize the map
        initializeMap();
      } else {
        // Google Maps API is not loaded, load it dynamically
        loadGoogleMapsScript();
      }
    };

    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      }&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () =>
        console.error('Google Maps API script failed to load');
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 34.052235, lng: -118.243683 }, // Example: Los Angeles coordinates
          zoom: 12,
        });

        // Add a marker (optional)
        new window.google.maps.Marker({
          position: { lat: 34.052235, lng: -118.243683 },
          map: map,
          title: 'Los Angeles',
        });

        console.log('Google Map initialized successfully');
      }
    };

    initMap();

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const script = document.querySelector(
        `script[src*="maps.googleapis.com"]`,
      );
      if (script) {
        script.remove();
        console.log('Google Maps API script removed');
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '500px' }}
      id="map"
    ></div>
  );
};

export default GoogleMap;
