import axios from 'axios';
import { BACKEND_BASEURL } from '../constants';

const electricityPriceAPI = axios.create({
    baseURL: BACKEND_BASEURL,
});

export const fetchCurrentElectricityPrice = async () => {
    try {
        const response = await electricityPriceAPI.get('/electricity-price');
        const price = response.data.price;
        const dateTime = response.data.dateTime;

        return { price, dateTime };
    } catch (error) {
        console.error(error);
        return null;
    }
}
