import React, { useState, useEffect, useRef } from 'react';
import { fetchCurrentElectricityPrice, fetchWeatherDataForCity } from './api/APIUtils';
import ElectricityPriceDisplay from './components/ElectricityPriceDisplay';
import WeatherCurrentDisplay from './components/WeatherCurrentDisplay';
import WeatherForecastDisplay from './components/WeatherForecastDisplay';
import CitySelector from './components/CitySelector';
import TemperatureGraph from './components/TemperatureGraph';
import { ELECTRICITY_FETCH_INTERVAL } from './constants';
import './style.css';



function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const App = () => {
    const [price, setPrice] = useState(null);
    const [lastChecked, setLastChecked] = useState(null);
    const [showEuros, setShowEuros] = useState(false);
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [city, setCity] = useState('Helsinki');
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        fetchWeatherDataForCity(city)
            .then(data => setWeatherData(data))
            .catch(error => console.error(error));
    }, [city]);

    const fetchPrice = () => {
        console.log('Fetching price...');
        fetchCurrentElectricityPrice()
            .then((data) => {
                if (data !== null) {
                    setPrice(data.price);
                    setLastChecked(Date.now());
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchPrice();
    }, []);

    useInterval(fetchPrice, ELECTRICITY_FETCH_INTERVAL);

    const handleRefreshClick = () => {
        setPrice(null);
        fetchPrice();
    };

    return (
        <div className="app">
            <ElectricityPriceDisplay price={price} lastChecked={lastChecked} onRefresh={handleRefreshClick} />
            <CitySelector city={city} setCity={setCity} />
            {weatherData && (
                <>
                    <WeatherCurrentDisplay weatherData={weatherData.current} />
                    <WeatherForecastDisplay forecastData={weatherData.forecast} />
                    <TemperatureGraph data={weatherData.forecast} />
                </>
            )
            }
        </div>
    );
};

export default App;