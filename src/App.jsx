import { useState } from "react";

function App() {
  const [city, setCity] = useState("");       // input
  const [weather, setWeather] = useState(null); // API response
  const [error, setError] = useState("");     // errors

  const fetchWeather = async () => {
    if (!city) return;
    try {
      setError("");
      setWeather(null);

      // 1. Get city coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Get weather for coordinates
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        name,
        country,
        ...weatherData.current_weather,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-white mb-6">Weather Now 🌤️</h1>

      {/* Search Input */}
      <div className="flex w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 p-3 rounded-l-xl outline-none"
        />
        <button
          onClick={fetchWeather}
          className="bg-yellow-400 text-black px-4 py-2 rounded-r-xl font-semibold hover:bg-yellow-300"
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-200">{error}</p>}

      {/* Weather Card */}
      {weather && (
        <div className="mt-8 bg-white/20 backdrop-blur-md p-6 rounded-xl text-white w-full max-w-md text-center shadow-lg">
          <h2 className="text-2xl font-semibold">
            {weather.name}, {weather.country}
          </h2>
          <p className="text-5xl font-bold mt-2">{weather.temperature}°C</p>
          <p className="mt-2">💨 Wind: {weather.windspeed} km/h</p>
          <p className="mt-1">🧭 Direction: {weather.winddirection}°</p>
        </div>
      )}
    </div>
  );
}

export default App;
