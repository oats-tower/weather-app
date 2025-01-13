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
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [position, setPosition] = useState([51.505, -0.09]);

  const handleLocationInput = (e) => {
    const input = e.target.value;
    
    if (input.includes(',')) {
      // Split input on comma and trim whitespace
      const [cityPart, countryPart] = input.split(',').map(part => part.trim());
      setCity(cityPart);
      setCountry(countryPart);
    } else {
      setCity(input);
      setCountry('');
    }
  };

  useEffect(() => {
    if (city) {
      const getWeatherData = async () => {
        // Format query with country if provided
        const query = country ? `${city},${country}` : city;
        const data = await fetchWeatherData(query);
        
        if (data) {
          setWeatherData(data);
          setPosition([data.coord.lat, data.coord.lon]);
        }
      };
      getWeatherData();
    }
  }, [city, country]);

  return (
    <div className="App">
      <h1>Weather App</h1>
      
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Enter city, country" 
          value={city}
          onChange={handleLocationInput}
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
          zoom={9} 
          style={{ height: "100%" }}
        >
          <MapUpdater center={position} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
            lang="en"
          />
          {weatherData && (
            <Marker position={position}>
              <Popup>{`${weatherData.name}, ${weatherData.sys.country}`}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;

