/**
 * Archivo principal. Flujo de aplicación, Eventos y Coordinación.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements Referencias ---
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    const currentWeatherContainer = document.getElementById('currentWeatherContainer');
    const hourlyForecastContainer = document.getElementById('hourlyForecastContainer');
    const savedLocationsContainer = document.getElementById('savedLocationsContainer');
    const globalMessageContainer = document.getElementById('globalMessageContainer');

    const locationsModal = document.getElementById('locationsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addLocationBtn = document.getElementById('addLocationBtn');
    const modalSearchInput = document.getElementById('modalSearchInput');
    const modalSearchSuggestions = document.getElementById('modalSearchSuggestions');
    const modalSavedLocations = document.getElementById('modalSavedLocations');

    const radarCard = document.getElementById('radarCard');

    let currentSearchedCity = null;

    // --- Control de init ---
    initApp();

    function initApp() {
        refreshSavedCities();
        
        // Event listeners basicos Header Busqueda
        setupSearchDebouncer(searchInput, searchSuggestions, handleCitySelect);

        // Modal de búsqueda (Añadir Location)
        addLocationBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        setupSearchDebouncer(modalSearchInput, modalSearchSuggestions, handleCityAddFromModal);

        // Radar Card Click -> Detectar Ubicación
        radarCard.addEventListener('click', detectCurrentLocation);

        // Pre-carga: Priorizar geolocalización si es primera vez o no hay ciudades
        const stored = StorageService.getSavedCities();
        if (stored.length > 0) {
            handleCitySelect(stored[0]);
        } else {
            // Intentar detectar automáticamente al inicio si el usuario lo permite
            detectCurrentLocation();
        }
    }

    /**
     * Usa la API de Geolocalización del navegador
     */
    function detectCurrentLocation() {
        if (!navigator.geolocation) {
            UI.showGlobalMessage(globalMessageContainer, "Tu navegador no soporta geolocalización", true);
            return;
        }

        UI.showGlobalMessage(globalMessageContainer, "Detectando tu ubicación...");

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Intentar obtener el nombre de la ciudad
            const cityInfo = await ApiService.reverseGeocode(latitude, longitude);
            
            const cityObj = {
                name: cityInfo.name,
                country: cityInfo.country,
                latitude: latitude,
                longitude: longitude,
                id: `geo-${latitude}-${longitude}` // ID temporal
            };

            handleCitySelect(cityObj);
        }, (error) => {
            console.warn("Geolocation error:", error);
            UI.showGlobalMessage(globalMessageContainer, "No se pudo acceder a tu ubicación. Por favor, búscala manualmente.", true);
        }, {
            timeout: 10000
        });
    }

    // --- Lógica Principal (Carga) ---
    async function handleCitySelect(city) {
        // Ocultar sugerencias
        searchSuggestions.classList.add('hidden');
        searchInput.value = ''; // Limpiar
        
        if (locationsModal && !locationsModal.classList.contains('hidden')) {
            closeModal();
        }

        currentSearchedCity = city;
        
        // Actualizar etiqueta radar
        UI.updateRadarLabel(city.name);

        // Fetch clima actual y forecast
        UI.clearContainer(currentWeatherContainer);
        currentWeatherContainer.appendChild(UI.createElement('div', ['placeholder-text'], 'Cargando clima de ' + city.name + '...'));
        
        try {
            const weather = await ApiService.getWeather(city.latitude, city.longitude);
            if (!weather) {
                throw new Error("No se pudo obtener el clima.");
            }
            // Render
            UI.renderCurrentWeather(currentWeatherContainer, city, weather);
            UI.renderHourlyForecast(hourlyForecastContainer, weather);
        } catch(error) {
            UI.showGlobalMessage(globalMessageContainer, "Error al cargar la información: " + error.message, true);
            UI.clearContainer(currentWeatherContainer);
            currentWeatherContainer.appendChild(UI.createElement('div', ['placeholder-text'], 'Ocurrió un error :('));
        }
    }

    // --- Modal Lógica  ---
    function openModal() {
        refreshModalSavedCities();
        locationsModal.classList.remove('hidden');
    }

    function closeModal() {
        locationsModal.classList.add('hidden');
        modalSearchInput.value = '';
        modalSearchSuggestions.classList.add('hidden');
    }

    function handleCityAddFromModal(city) {
        modalSearchSuggestions.classList.add('hidden');
        modalSearchInput.value = '';

        const success = StorageService.saveCity(city);
        if (success) {
            UI.showGlobalMessage(globalMessageContainer, city.name + " añadida a favoritos.");
            refreshModalSavedCities();
            refreshSavedCities();
        } else {
            UI.showGlobalMessage(globalMessageContainer, city.name + " ya está en tu lista.", true);
        }
    }

    function refreshSavedCities() {
        const stored = StorageService.getSavedCities();
        UI.renderSavedCitiesList(savedLocationsContainer, stored, (city) => {
            handleCitySelect(city);
        }, (cityToRemove) => {
            StorageService.removeCity(cityToRemove.id);
            refreshSavedCities();
            refreshModalSavedCities();
        });
    }

    function refreshModalSavedCities() {
        const stored = StorageService.getSavedCities();
        UI.renderSavedCitiesList(modalSavedLocations, stored, (city) => {
            handleCitySelect(city);
        }, (cityToRemove) => {
            StorageService.removeCity(cityToRemove.id);
            refreshModalSavedCities();
            refreshSavedCities();
        });
    }

    // --- Utils Busqueda con Debounce ---
    function setupSearchDebouncer(inputEl, suggestionBox, onSelectCb) {
        let debounceTimer;

        inputEl.addEventListener('input', (e) => {
            const query = e.target.value;
            clearTimeout(debounceTimer);
            if(query.trim().length <= 2) {
                suggestionBox.classList.add('hidden');
                return;
            }
            debounceTimer = setTimeout(async () => {
                const results = await ApiService.searchCities(query);
                if (results.length === 0) {
                    UI.renderSuggestions(suggestionBox, [{name: 'No se encontraron resultados'}], () => {
                         suggestionBox.classList.add('hidden');
                    });
                } else {
                    UI.renderSuggestions(suggestionBox, results, onSelectCb);
                }
            }, 500); // 500ms delay para no agotar limite API
        });
        
        // Hide sugestions on outside click
        document.addEventListener('click', (e) => {
            if (!inputEl.contains(e.target) && !suggestionBox.contains(e.target)) {
                suggestionBox.classList.add('hidden');
            }
        });
    }

});
