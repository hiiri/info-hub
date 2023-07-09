import axios from 'axios';
import { BACKEND_BASEURL } from '../constants';

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



export const fetchCurrentWeather = async (city) => {
    try {
        const response = await backendAPI.get(`/weather/${city}`);
        const temperature = response.data.main.temp;
        const icon = response.data.weather[0].icon;
        const description = response.data.weather[0].description;
        console.log(response.data)

        return { temperature, icon, description };
    } catch (error) {
        console.error(error);
        return null;
    }
}