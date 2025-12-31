import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ---------------- LEAFLET ICON FIX ---------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

/* ---------------- MAP RECENTER ---------------- */
function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 13);
    }
  }, [location]);

  return null;
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function SafeRouteFinder() {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [route, setRoute] = useState([]);

  /*  Fetch user location (on button click) */
  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Please allow location access"),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  /*  Fetch nearby safe places (5 km) */
  useEffect(() => {
    if (!location) return;

    const fetchPlaces = async () => {
      const query = `
        [out:json];
        (
          node["amenity"="hospital"](around:5000,${location.lat},${location.lng});
          node["amenity"="police"](around:5000,${location.lat},${location.lng});
          node["amenity"="fire_station"](around:5000,${location.lat},${location.lng});
        );
        out body;
      `;

      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      const data = await res.json();
      setPlaces(data.elements);
    };

    fetchPlaces();
  }, [location]);

  /*  Draw evacuation route */
  const drawRoute = async (dest) => {
    const url = `https://router.project-osrm.org/route/v1/driving/${location.lng},${location.lat};${dest.lon},${dest.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();

    setRoute(
      data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]])
    );
  };

  return (
      <div className="min-h-screen bg-white text-gray-800 px-4 py-6">
    <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-extrabold text-orange-600">
             Safe Route Finder
            <span className="ml-2 text-sm text-orange-500"></span>
          </h1>
          <p className="text-sm text-black-400">
            GPS-based evacuation routing & nearby emergency services
          </p>
        </div>

        {/* USE LOCATION BUTTON */}
        <button
          onClick={useMyLocation}
           className="
          w-full py-4 rounded-2xl text-lg font-semibold text-white
          bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
          shadow-lg hover:shadow-orange-300
          hover:scale-[1.02] transition
        ">
           Use My Location
        </button>

        {/* SAFE ZONE DROPDOWN */}
        {places.length > 0 && (
          <select
            className="
            w-full p-4 rounded-2xl
            bg-white
            border border-orange-400
            focus:outline-none focus:ring-2 focus:ring-orange-500
            text-gray-700"
            onChange={(e) => {
              const place = places.find(
                (p) => p.id === Number(e.target.value)
              );
              setSelected(place);
              drawRoute(place);
            }}>
            <option>Select Safe Zone</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.tags?.name || "Unnamed"} — {p.tags?.amenity}
              </option>
            ))}
          </select>
        )}

        {/* MAP CONTAINER */}
        <div className="relative rounded-3xl overflow-hidden border border-orange-300 shadow-lg">
          {!location && (
             <div className="absolute z-10 top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white text-orange-500 border border-orange-300 animate-pulse">
               Fetching GPS location…
            </div>
          )}
          <MapContainer
            center={location ? [location.lat, location.lng] : [13.0827, 80.2707]}
            zoom={13}
            className="h-[520px] w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <RecenterMap location={location} />

            {/* USER LOCATION */}
            {location && (
              <Marker position={[location.lat, location.lng]}>
                <Popup>You are here</Popup>
              </Marker>
            )}

            {/* SELECTED SAFE ZONE */}
            {selected && (
              <Marker position={[selected.lat, selected.lon]}>
                <Popup>
                  <b>{selected.tags?.name}</b>
                  <br />
                  {selected.tags?.amenity}
                </Popup>
              </Marker>
            )}

            {/* EVACUATION ROUTE */}
            {route.length > 0 && (
              <>
                <Polyline
                positions={route}
                pathOptions={{ color: "#166534", weight: 6, opacity: 0.9 }}
              />
              <Polyline
                positions={route}
                pathOptions={{ color: "#166534", weight: 6, opacity: 0.9 }}
              />
            </>
            )}
          </MapContainer>
        </div>

        {/* FOOTER */}
        <div className="text-xs text-gray-400 text-center">
          Emergency data powered by OpenStreetMap • Routing via OSRM
        </div>
      </div>
    </div>
  );
}
