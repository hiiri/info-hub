import React from 'react';

const WeatherCurrentDisplay = ({ weatherData }) => {
  if (!weatherData) {
    return <p>Loading weather...</p>;
  }
  const temperature = weatherData.main.temp;
  const conditions = weatherData.weather[0];

  return (
    <div className="weather-container">
      <p>
        The current temperature is {' '}
        <span className="weather-temperature">
          {temperature} °C
        </span>
        <img className="weather-icon"
          src={`https://openweathermap.org/img/wn/${conditions.icon}@2x.png`} alt={conditions.description}
        />
      </p>
    </div>
  );
};

export default WeatherCurrentDisplay;
