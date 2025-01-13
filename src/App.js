/**
 * Weather App with interactive map
 * @module App
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchWeatherData } from './weatherService';
import './App.css';

// Add MapUpdater component
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function App() {
  // State initialization
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [position, setPosition] = useState([51.505, -0.09]);  // Default map center

  /**
   * Fetches weather data when city changes
   * Updates map position with new coordinates
   */
  useEffect(() => {
    if (city) {
      const getWeatherData = async () => {
        const data = await fetchWeatherData(city);
        setWeatherData(data);
        if (data && data.coord) {
          setPosition([data.coord.lat, data.coord.lon]);
        }
      };
      getWeatherData();
    }
  }, [city]);

  return (
    <div className="App">
      <h1>World Weather</h1>
      
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Enter city" 
          value={city} 
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div className="weather-info">
        {weatherData ? (
          <>
            <h2>{weatherData.name}</h2>
            <div className="temperature">
              {Math.round(weatherData.main.temp)}°C
            </div>
            <div className="weather-description">
              {weatherData.weather[0].description}
            </div>
            <div className="weather-details">
              <div className="weather-detail-row">
                <span className="weather-detail-label">Humidity</span>
                <span className="weather-detail-value">{weatherData.main.humidity}%</span>
              </div>
              <div className="weather-detail-row">
                <span className="weather-detail-label">Wind Speed</span>
                <span className="weather-detail-value">{weatherData.wind.speed} m/s</span>
              </div>
            </div>
          </>
        ) : (
          <div className="placeholder-text">
            Enter a city name to check weather
          </div>
        )}
      </div>

      <div className="map-container">
        <MapContainer 
          center={position} 
          zoom={13} 
          style={{ height: "100%" }}
        >
          <MapUpdater center={position} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {weatherData && (
            <Marker position={position}>
              <Popup>{city}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;

