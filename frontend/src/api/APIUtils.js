import axios from 'axios';
import { BACKEND_BASEURL, WEATHER_CACHE_KEY_PREFIX, WEATHER_CACHE_EXPIRATION_IN_MINUTES } from '../constants';

const backendAPI = axios.create({
    baseURL: BACKEND_BASEURL,
});

export const fetchCurrentElectricityPrice = async () => {
    try {
        const response = await backendAPI.get('/electricity-price');
        const price = response.data.price;
        const dateTime = response.data.dateTime;

        return { price, dateTime };
    } catch (error) {
        console.error(error);
        return { error: error.message };
    }
}
export const fetchWeatherDataForCity = async (city) => {
    // Cache weather data in browser localStorage
    const cacheKey = WEATHER_CACHE_KEY_PREFIX + city;
    const cachedWeatherData = localStorage.getItem(cacheKey);
  
    if (cachedWeatherData) {
      const parsedData = JSON.parse(cachedWeatherData);
      const { timestamp, data } = parsedData;
  
      if (Date.now() - timestamp < WEATHER_CACHE_EXPIRATION_IN_MINUTES * 60 * 1000) {
        return data;
      }
    }
  
    try {
      const response = await backendAPI.get(`/weather/${city}`);
      const weatherData = response.data;
  
      // Cache the weather data with the current timestamp
      const dataToCache = { timestamp: Date.now(), data: weatherData };
      localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
  
      return weatherData;
    } catch (error) {
      console.error(error);
      return null;
    }
  };