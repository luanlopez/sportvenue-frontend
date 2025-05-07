"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";

interface CourtMapProps {
  address: string;
  number: string;
  neighborhood: string;
  city: string;
}

export function CourtMap({ address, number, neighborhood, city }: CourtMapProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const query = `${address} - ${number}, ${neighborhood}, ${city}`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`
        );
        const data = await response.json();
        
        if (data && data[0]) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordinates();
  }, [address, number, neighborhood, city]);

  if (isLoading) {
    return (
      <div className="h-[400px] bg-tertiary-500/50 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!position) {
    return (
      <div className="h-[400px] bg-tertiary-500/50 rounded-lg flex items-center justify-center">
        <p className="text-primary-500">Localização não encontrada</p>
      </div>
    );
  }

  const customIcon = new Icon({
    iconUrl: "/map-marker.svg",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

  return (
    <div className="h-[400px] rounded-lg overflow-hidden border border-primary-500">
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=dwmm4fEcuMd84mCQrsQq"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="p-2">
              <p className="font-semibold text-primary-500">{`${address}, ${number}`}</p>
              <p className="text-sm text-primary-500/70">{`${neighborhood}, ${city}`}</p>
              <button
                className="mt-2 px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition disabled:opacity-60"
                disabled={isSharing}
                onClick={async () => {
                  const url = `https://www.google.com/maps?q=${position[0]},${position[1]}`;
                  if (navigator.share) {
                    try {
                      setIsSharing(true);
                      await navigator.share({
                        title: 'Localização da quadra',
                        url,
                      });
                    } catch (e) {
                      console.error("Erro ao compartilhar:", e);
                    } finally {
                      setIsSharing(false);
                    }
                  } else {
                    navigator.clipboard.writeText(url);
                    alert('Link copiado para a área de transferência!');
                  }
                }}
              >
                Compartilhar Localização
              </button>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
} 