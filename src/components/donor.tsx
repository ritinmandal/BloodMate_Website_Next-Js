"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";

const bloodIcon = new L.Icon({
  iconUrl: "/public/images/logo.png", 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

type Donor = {
  id: number;
  name: string;
  bloodGroup: string;
  location: [number, number];
  lastDonation: string;
};

const donors: Donor[] = [
  {
    id: 1,
    name: "Rahul Verma",
    bloodGroup: "O+",
    location: [28.7041, 77.1025], 
    lastDonation: "2025-07-01",
  },
  {
    id: 2,
    name: "Priya Sharma",
    bloodGroup: "A-",
    location: [19.076, 72.8777], 
    lastDonation: "2025-06-15",
  },
];

function FlyToLocation({ location }: { location: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(location, 12, { duration: 2 });
  }, [location, map]);
  return null;
}

export default function DonorMap() {
  const [focusLocation, setFocusLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/marker-icon-2x.png",
      iconUrl: "/images/logo.png",
      shadowUrl: "/marker-shadow.png",
    });
  }, []);

  return (
    <div className="w-full h-[90vh] flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-xl">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/3 bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col"
      >
        <h2 className="text-2xl font-bold text-red-700 mb-4">Nearby Donors</h2>
        <div className="overflow-y-auto max-h-[70vh] space-y-4">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {donor.name}
                </h3>
                <span className="px-2 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700">
                  {donor.bloodGroup}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Last Donation: {donor.lastDonation}
              </p>
              <button
                onClick={() => {
                  if (donor.name === "Rahul Verma") {
                    setFocusLocation(donor.location);
                  }if (donor.name === "Priya Sharma") {
                    setFocusLocation(donor.location);
                  }
                }}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 text-sm"
              >
                Request Blood
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-2/3 h-[80vh] rounded-xl overflow-hidden shadow-lg"
      >
        <MapContainer
          center={[20.5937, 78.9629]} 
          zoom={5}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          {donors.map((donor) => (
            <Marker key={donor.id} position={donor.location} icon={bloodIcon}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-red-700">{donor.name}</h3>
                  <p className="text-sm">Blood Group: {donor.bloodGroup}</p>
                  <p className="text-xs">Last Donation: {donor.lastDonation}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {focusLocation && <FlyToLocation location={focusLocation} />}
        </MapContainer>
      </motion.div>
    </div>
  );
}
