/**
 * Comunicación con las APIS
 */

const ApiService = {
    GEO_URL: 'https://geocoding-api.open-meteo.com/v1/search',
    WEATHER_URL: 'https://api.open-meteo.com/v1/forecast',

    /**
     * Busca ciudades por nombre usando la API GeoCoding de open-meteo
     * @param {string} query nombre o texto
     */
    searchCities: async function(query) {
        if (!query || query.trim() === '') return [];
        try {
            // Buscamos resultados con un parametro simple. count 5. language es.
            const res = await fetch(`${this.GEO_URL}?name=${encodeURIComponent(query)}&count=5&language=es&format=json`);
            if (!res.ok) throw new Error('Error en Geo API');
            const data = await res.json();
            return data.results || [];
        } catch (error) {
            console.error('API Error (Search):', error);
            return [];
        }
    },

    /**
     * Obtiene el nombre de la ciudad a partir de coordenadas usando Nominatim (OpenStreetMap)
     * @param {number} latitude 
     * @param {number} longitude 
     */
    reverseGeocode: async function(latitude, longitude) {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;
            const res = await fetch(url, {
                headers: {
                    'Accept-Language': 'es'
                }
            });
            if (!res.ok) throw new Error('Error en Reverse Geo API');
            const data = await res.json();
            return {
                name: data.address.city || data.address.town || data.address.village || data.address.state || 'Tu Ubicación',
                country: data.address.country || ''
            };
        } catch (error) {
            console.error('API Error (Reverse Geo):', error);
            return { name: 'Tu Ubicación', country: '' };
        }
    },

    /**
     * Obtiene el clima para coordenadas determinadas. Se solicitan variables de interes.
     * @param {number} latitude 
     * @param {number} longitude 
     */
    getWeather: async function(latitude, longitude) {
        try {
            const extraParams = [
                'current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
                'hourly=temperature_2m,weather_code',
                'timezone=auto',
                'forecast_days=2'
            ].join('&');
            
            const url = `${this.WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&${extraParams}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Error en Weather API');
            
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('API Error (Weather):', error);
            return null;
        }
    }
};
