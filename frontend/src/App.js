import React, { useState, useEffect, useRef } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { fetchCurrentElectricityPrice, fetchCurrentWeather } from './api/APIUtils';

import './style.css';
import { ELECTRICITY_FETCH_INTERVAL, WEATHER_FETCH_INTERVAL } from './constants';

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
    const [time, setTime] = useState(Date.now());
    const [showEuros, setShowEuros] = useState(false);
    const [weather, setWeather] = useState(null);

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

    const fetchWeather = () => {
        console.log('Fetching weather...');
        const city = 'Helsinki';
        fetchCurrentWeather(city)
            .then((data) => {
                console.log(weather)
                if (data !== null) {
                    setWeather(data);
                    setLastChecked(Date.now());
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchWeather();
        const interval = setInterval(fetchWeather, WEATHER_FETCH_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchPrice();
    }, []);


    useInterval(fetchPrice, ELECTRICITY_FETCH_INTERVAL);
    useInterval(() => setTime(Date.now()), 1000);

    const priceToCents = (price) => {
        return (price * 100).toFixed(2);
    };

    const handleRefreshClick = () => {
        setPrice(null);
        fetchPrice();
    };

    const formatTimeElapsed = () => {
        if (lastChecked !== null) {
            const secondsElapsed = Math.floor((Date.now() - lastChecked) / 1000);
            const minutes = Math.floor(secondsElapsed / 60);
            const seconds = secondsElapsed % 60;
            return `${minutes} minutes and ${seconds} seconds ago`;
        } else {
            return "0 minutes and 0 seconds ago";
        }
    };

    const options = [
        'Finland',
    ];
    const defaultOption = options[0];

    const _onSelect = (option) => {
        console.log('You selected ', option);
    };

    const handlePriceClick = () => {
        setShowEuros(!showEuros);
    };


    return (
        <div className="app">
            <h1 className="title">Electricity Price</h1>
            {price !== null ? (
                <div>
                    <p>
                        The current price is {' '}
                        <span onClick={handlePriceClick} className={`price ${showEuros ? 'clicked' : ''}`}>
                            {showEuros
                                ? `${price} €`
                                : `${priceToCents(price)} ¢`}</span> / kWh.
                    </p>
                    <p className="last-checked">Last checked: {formatTimeElapsed()}</p>
                </div>
            ) : (
                <div>
                    <p className="loading">Loading...</p>
                </div>
            )}
            <button className="refresh-button" onClick={handleRefreshClick}>{price !== null ? 'Refresh' : 'Refreshing...'}</button>
            <Dropdown className="country-selector" options={options} onChange={_onSelect} value={defaultOption} placeholder="Select an option" />

            <div className="weather">
                <h1 className="title">Weather</h1>
                {weather !== null ? (
                    <div className='weather-container'>
                        <p>
                            The current temperature is {' '}
                            <span className="weather-temperature">
                                {weather.temperature} °C
                            </span>

                            <img className="weather-icon"
                                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description}
                            />

                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="loading">Loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;