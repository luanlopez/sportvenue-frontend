/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  address: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    googleMapsLoaded?: boolean;
  }
}

let scriptLoading = false;

export function GoogleMap({ address, className = "" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps && window.googleMapsLoaded) {
        setIsMapReady(true);
        initializeMap();
        return;
      }

        if (scriptLoading) {
        const checkLoaded = setInterval(() => {
          if (window.google && window.google.maps && window.googleMapsLoaded) {
            clearInterval(checkLoaded);
            setIsMapReady(true);
            initializeMap();
          }
        }, 100);
        return;
      }

      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        scriptLoading = true;
        const checkLoaded = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkLoaded);
            scriptLoading = false;
            window.googleMapsLoaded = true;
            setIsMapReady(true);
            initializeMap();
          }
        }, 100);
        return;
      }
      
      scriptLoading = true;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoading = false;
        window.googleMapsLoaded = true;
        setIsMapReady(true);
        initializeMap();
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          
          const mapOptions = {
            center: location,
            zoom: 15,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          };

          mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
          
          const customIcon = {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Flag pole -->
                <rect x="22" y="10" width="6" height="30" fill="#8B4513"/>
                <!-- Flag -->
                <path d="M28 12 L44 15 L44 25 L28 22 Z" fill="#1345BA"/>
                <!-- Sport ball icon on flag -->
                <circle cx="36" cy="18" r="4" fill="white" stroke="#1345BA" stroke-width="1.5"/>
                <path d="M33 18 L39 18 M36 15 L36 21" stroke="#1345BA" stroke-width="1.5" stroke-linecap="round"/>
                <!-- Shadow -->
                <ellipse cx="25" cy="40" rx="10" ry="3" fill="rgba(0,0,0,0.2)"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(50, 50),
            anchor: new window.google.maps.Point(25, 40)
          };

          markerRef.current = new window.google.maps.Marker({
            position: location,
            map: mapInstanceRef.current,
            title: address,
            icon: customIcon,
            animation: window.google.maps.Animation.DROP
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding: 8px; font-weight: 500;">${address}</div>`
          });

          markerRef.current.addListener('click', () => {
            infoWindow.open(mapInstanceRef.current, markerRef.current);
          });

        } else {
          const defaultLocation = { lat: -23.5505, lng: -46.6333 };
          
          mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
            center: defaultLocation,
            zoom: 10,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding: 8px; color: #e53e3e;">Não foi possível localizar o endereço: ${address}</div>`
          });
          
          infoWindow.setPosition(defaultLocation);
          infoWindow.open(mapInstanceRef.current);
        }
      });
    };

    loadGoogleMaps();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (mapInstanceRef.current) {
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }
      }
    };
  }, [address]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full min-h-[350px] rounded-lg ${className}`}
      style={{ minHeight: '350px' }}
    >
      {!isMapReady && (
        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-50 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
} 