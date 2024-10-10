import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Location parameter
interface Location {
    latitude: number;
    longitude: number;
}

// Define the function to extract the city from location
export const extractCityFromLocation = async (location: Location): Promise<string> => {
    const { latitude, longitude } = location;

    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.GEOCODING_API_KEY}`;

    try {
        const response: any = await axios.get(apiUrl);
        const results = response.data.results;

        if (results.length > 0) {
            const components = results[0].components;
            const city = components.city || components.town || components.village || components.hamlet;

            if (city) {
                return city;
            } else {
                throw new Error('City not found in components');
            }
        } else {
            throw new Error('No results from geocoding API');
        }
    } catch (error) {
        console.error('Error extracting city from location:', error);
        throw error; // Rethrow the error after logging it
    }
}
