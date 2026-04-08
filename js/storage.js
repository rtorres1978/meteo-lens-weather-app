/**
 * Manejo de LocalStorage
 */
const StorageService = {
    // Clave para guardar ciudades en localstorage
    STORE_KEY: 'weatherLocations',

    /**
     * Obtiene las ciudades guardadas, evita errores en caso de vacío.
     */
    getSavedCities: function () {
        const data = localStorage.getItem(this.STORE_KEY);
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error("Error al parear localstorage:", e);
                return [];
            }
        }
        return [];
    },

    /**
     * Guarda una ciudad verificando duplicados
     * @param {Object} city - objeto ciudad, requiriere id, name, latitude, longitude
     * @returns {boolean} true si fue guardado, false si está duplicado
     */
    saveCity: function (city) {
        let cities = this.getSavedCities();
        const exists = cities.find(c => c.id === city.id);
        if (!exists) {
            cities.push(city);
            localStorage.setItem(this.STORE_KEY, JSON.stringify(cities));
            return true;
        }
        return false;
    },

    /**
     * Elimina una ciudad por su identificador
     */
    removeCity: function (cityId) {
        let cities = this.getSavedCities();
        cities = cities.filter(c => c.id !== cityId);
        localStorage.setItem(this.STORE_KEY, JSON.stringify(cities));
        return true;
    }
};
