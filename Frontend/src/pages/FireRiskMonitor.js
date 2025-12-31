import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
/* Leaflet icon fix */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const OWM_KEY = process.env.REACT_APP_OWM_KEY;
export default function AreaFireRiskAdvanced() {
  const [area, setArea] = useState("");
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [risk, setRisk] = useState(null);
  const [trend, setTrend] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- FDI ---------- */
  const computeFDI = (temp, humidity, wind) => {
    return Math.round(
      (temp / 50) * 45 +
      ((100 - humidity) / 100) * 35 +
      (wind / 50) * 20
    );
  };

  const getRiskLevel = (fdi) => {
    if (fdi >= 80) return "Extreme";
    if (fdi >= 60) return "High";
    if (fdi >= 40) return "Medium";
    return "Low";
  };

  /* ---------- CURRENT WEATHER ---------- */
  const processCurrent = (data) => {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const wind = Math.round(data.wind.speed * 3.6);

    const fdi = computeFDI(temp, humidity, wind);

    setWeather({
      name: data.name || "Your Location",
      temp,
      humidity,
      wind,
    });

    setRisk({
      fdi,
      level: getRiskLevel(fdi),
      safety: Math.max(100 - fdi, 0),
    });

    return fdi;
  };

  /* ---------- FORECAST TREND ---------- */
  const processForecast = (list, currentFDI) => {
    const next = list[1]; // ~3 hours later
    const temp = next.main.temp;
    const humidity = next.main.humidity;
    const wind = Math.round(next.wind.speed * 3.6);

    const futureFDI = computeFDI(temp, humidity, wind);

    let result = "Stable";
    if (futureFDI > currentFDI + 5) result = "Increasing";
    else if (futureFDI < currentFDI - 5) result = "Decreasing";

    setTrend(result);
    setForecast({ temp, humidity, wind });
  };

  /* ---------- FETCH BY COORDS ---------- */
  const fetchByCoords = async (lat, lon) => {
    setLoading(true);
    setError("");

    try {
      const current = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_KEY}`
      );

      const forecast = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_KEY}`
      );

      const currentFDI = processCurrent(current.data);
      processForecast(forecast.data.list, currentFDI);
    } catch {
      setError("Unable to fetch weather data");
    }

    setLoading(false);
  };

  /* ---------- CITY ---------- */
  const fetchByCity = async () => {
    if (!area.trim()) {
      setError("Please enter a city or area name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${area}&units=metric&appid=${OWM_KEY}`
      );

      const { lat, lon } = res.data.coord;
      setCoords([lat, lon]);
      fetchByCoords(lat, lon);
    } catch {
      setError("City not found");
      setLoading(false);
    }
  };

  /* ---------- GPS ---------- */
  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords([lat, lon]);
        fetchByCoords(lat, lon);
      },
      () => setError("Location access denied"),
      { enableHighAccuracy: true }
    );
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100 p-6 text-gray-800">
      <div className="max-w-6xl mx-auto rounded-2xl bg-white
border border-orange-200 shadow-xl p-6">
        <h2 className="text-3xl font-extrabold text-orange-600">
           My Area Fire Risk Monitor <span className="text-sm text-red-400"></span>
        </h2>
        <p className="text-zinc-400 mb-6">
        </p>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              setError("");
            }}
            placeholder="Enter city / area"
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-orange-300
focus:outline-none focus:ring-2 focus:ring-orange-500"/>
          <button
            onClick={fetchByCity}
            className="px-6 py-3 rounded-xl font-semibold
bg-green-500 text-white hover:bg-green-600">
            Check by City
          </button>
          <button
            onClick={useMyLocation}
            className="px-6 py-3 rounded-xl font-bold text-white
bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
             Use My Location
          </button>
        </div>
        {error && (
  <div className="mb-4 px-4 py-3 rounded-xl
    bg-orange-50 border border-orange-300
    text-orange-600 font-medium">
     {error}
  </div>
)}
        {weather && risk && (
          <div className="grid md:grid-cols-2 gap-6">

            {/* INFO */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                 Fire Risk Level:
                <span className={`ml-3 px-4 py-1 rounded-full font-bold
                  ${risk.level === "Extreme" ? "bg-red-600" :
                    risk.level === "High" ? "bg-orange-500" :
                    risk.level === "Medium" ? "bg-yellow-500 text-black" :
                    "bg-green-600"}`}>
                  {risk.level}
                </span>
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li> Location: {weather.name}</li>
                <li> Temperature: {weather.temp} °C</li>
                <li> Humidity: {weather.humidity} %</li>
                <li> Wind: {weather.wind} km/h</li>
              </ul>
              <div className="p-4 rounded-xl bg-white border border-orange-200">
                 Safety Score: <b>{risk.safety}/100</b><br />
                 FDI: <b>{risk.fdi}</b>
              </div>
              {trend && forecast && (
  <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/30">
    <h4 className="text-black-600 font-semibold text-lg mb-2">
      Fire Risk Trend (Next 3 Hours)
    </h4>
    <p className={`font-bold text-lg ${
      trend === "Increasing" ? "text-red-600" :
      trend === "Decreasing" ? "text-green-600" :
      "text-orange-500"
    }`}>
      {trend}
    </p>
    <p className="text-sm text-gray-700 mt-1">
      Forecast → Temp: {forecast.temp}°C | Humidity: {forecast.humidity}% | Wind: {forecast.wind} km/h
    </p>
  </div>
)}
            </div>

            {/* MAP */}
            <div className="h-[360px] rounded-2xl overflow-hidden
              border border-orange-300 bg-white shadow-[0_0_30px_rgba(255,80,0,0.4)]">
              {coords && (
                <MapContainer center={coords} zoom={10} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={coords}>
                    <Popup>{weather.name}</Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
