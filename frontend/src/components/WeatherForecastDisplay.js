import React from 'react';

const WeatherForecastDisplay = ({ forecastData }) => {
  const getWeekday = (date) => {
    const options = { weekday: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  if (!forecastData) {
    return <p>Loading forecast...</p>;
  }

  // Get the weather at 12:00 each day
  // TODO: min and max temperatures are more useful
  const dailyData = forecastData.list.filter((forecast) =>
    new Date(forecast.dt * 1000).getHours() === 12
  );

  return (
    <div className="forecast">
      {dailyData.slice(0, 7).map((forecast, index) => (
        <div key={index} className="forecast-day">
          <p>{getWeekday(new Date(forecast.dt * 1000))}</p>
          <p>{Math.round(forecast.main.temp)} °C</p>
          <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} alt={forecast.weather[0].description} />
        </div>
      ))}
    </div>
  );
};

export default WeatherForecastDisplay;
