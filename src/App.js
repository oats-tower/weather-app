import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from './weatherService';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (city) {
      const getWeatherData = async () => {
        const data = await fetchWeatherData(city);
        setWeatherData(data);
      };

      getWeatherData();
    }
  }, [city]);  // Re-run when city changes

  return (
    <div className="App">
      <h1>Weather App</h1>
      
      {/* Input field to enter the city */}
      <input 
        type="text" 
        placeholder="Enter city" 
        value={city} 
        onChange={(e) => setCity(e.target.value)} 
      />

      {/* Display weather data or loading message */}
      {weatherData ? (
        <div>
          <h2>{weatherData.name}</h2>
          <p>{weatherData.main.temp}°C</p>
          <p>{weatherData.weather[0].description}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}

export default App;

