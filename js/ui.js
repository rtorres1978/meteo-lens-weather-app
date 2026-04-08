/**
 * Control del DOM (Sin usar innerHTML en lo posible, o creando elementos de forma robusta)
 */

const UI = {
    // Mapa básico de códigos WMO para iconos y texto en español
    wmoMap: {
        0: { text: 'Cielo despejado', iconDay: 'sunny', iconNight: 'clear_night' },
        1: { text: 'Mayormente despejado', iconDay: 'partly_cloudy_day', iconNight: 'partly_cloudy_night' },
        2: { text: 'Parcialmente nublado', iconDay: 'partly_cloudy_day', iconNight: 'partly_cloudy_night' },
        3: { text: 'Nublado', iconDay: 'cloud', iconNight: 'cloud' },
        45: { text: 'Niebla', iconDay: 'foggy', iconNight: 'foggy' },
        48: { text: 'Niebla de escarcha', iconDay: 'foggy', iconNight: 'foggy' },
        51: { text: 'Llovizna leve', iconDay: 'rainy', iconNight: 'rainy' },
        53: { text: 'Llovizna moderada', iconDay: 'rainy', iconNight: 'rainy' },
        55: { text: 'Llovizna densa', iconDay: 'rainy', iconNight: 'rainy' },
        56: { text: 'Llovizna helada leve', iconDay: 'rainy', iconNight: 'rainy' },
        57: { text: 'Llovizna helada densa', iconDay: 'rainy', iconNight: 'rainy' },
        61: { text: 'Lluvia leve', iconDay: 'rainy', iconNight: 'rainy' },
        63: { text: 'Lluvia moderada', iconDay: 'rainy', iconNight: 'rainy' },
        65: { text: 'Lluvia fuerte', iconDay: 'rainy', iconNight: 'rainy' },
        66: { text: 'Lluvia helada leve', iconDay: 'rainy', iconNight: 'rainy' },
        67: { text: 'Lluvia helada fuerte', iconDay: 'rainy', iconNight: 'rainy' },
        71: { text: 'Nieve leve', iconDay: 'cloudy_snowing', iconNight: 'cloudy_snowing' },
        73: { text: 'Nieve moderada', iconDay: 'cloudy_snowing', iconNight: 'cloudy_snowing' },
        75: { text: 'Nieve fuerte', iconDay: 'cloudy_snowing', iconNight: 'cloudy_snowing' },
        77: { text: 'Granos de nieve', iconDay: 'cloudy_snowing', iconNight: 'cloudy_snowing' },
        80: { text: 'Chubascos de lluvia leves', iconDay: 'rainy', iconNight: 'rainy' },
        81: { text: 'Chubascos de lluvia moderados', iconDay: 'rainy', iconNight: 'rainy' },
        82: { text: 'Chubascos de lluvia fuertes', iconDay: 'rainy', iconNight: 'rainy' },
        85: { text: 'Chubascos de nieve leves', iconDay: 'cloudy_snowing', iconNight: 'cloudy_snowing' },
        86: { text: 'Chubascos de nieve fuertes', iconDay: 'cloudy_snowing', iconNight: 'cloudy_snowing' },
        95: { text: 'Tormenta leve a moderada', iconDay: 'thunderstorm', iconNight: 'thunderstorm' },
        96: { text: 'Tormenta con granizo leve', iconDay: 'thunderstorm', iconNight: 'thunderstorm' },
        99: { text: 'Tormenta con granizo fuerte', iconDay: 'thunderstorm', iconNight: 'thunderstorm' }
    },

    getWmoInfo: function(code, isDay = 1) {
        const info = this.wmoMap[code] || { text: 'Desconocido', iconDay: 'wb_cloudy', iconNight: 'wb_cloudy' };
        return {
            text: info.text,
            icon: isDay ? info.iconDay : info.iconNight
        };
    },

    createElement: function(tag, classes = [], text = null, attributes = {}) {
        const el = document.createElement(tag);
        if (classes.length) el.classList.add(...classes);
        if (text) el.textContent = text;
        for (const [key, val] of Object.entries(attributes)) {
            el.setAttribute(key, val);
        }
        return el;
    },

    clearContainer: function(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    },

    /**
     * Renderiza los resultados de busqueda en el ul proporcionado.
     */
    renderSuggestions: function(container, list, onSelectCallback) {
        this.clearContainer(container);
        if (!list || list.length === 0) {
            container.classList.add('hidden');
            return;
        }

        list.forEach(city => {
            const li = this.createElement('li', ['search-suggestion-item']);
            const text = `${city.name}${city.admin1 ? ', ' + city.admin1 : ''}${city.country ? ' - ' + city.country : ''}`;
            li.textContent = text;
            li.addEventListener('click', () => onSelectCallback(city));
            container.appendChild(li);
        });

        container.classList.remove('hidden');
    },

    /**
     * Helper param mostrar fechas como en el prototipo
     */
    formatDateInfo: function() {
        const d = new Date();
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;
    },

    /**
     * Renderiza el panel principal de datos
     */
    renderCurrentWeather: function(container, city, weather) {
        this.clearContainer(container);
        
        let current = weather.current;
        let isDay = current.is_day;
        let wmoInfo = this.getWmoInfo(current.weather_code, isDay);

        // Header Superior
        const hdr = this.createElement('div', ['weather-header']);
        const titleDiv = this.createElement('div');
        const h2 = this.createElement('h2', ['weather-city'], city.name);
        const pDate = this.createElement('p', ['weather-date'], this.formatDateInfo());
        titleDiv.appendChild(h2);
        titleDiv.appendChild(pDate);

        const statusDiv = this.createElement('div', ['weather-status']);
        const statusDot = this.createElement('span', ['status-dot']);
        // Parse time: (2025-05-24T14:00) -> 14:00
        const timeH = current.time.split('T')[1] || '00:00';
        statusDiv.appendChild(statusDot);
        statusDiv.appendChild(document.createTextNode(`Actualizado a las ${timeH}`));

        hdr.appendChild(titleDiv);
        hdr.appendChild(statusDiv);

        // Temp Principal e Icono
        const mainInfo = this.createElement('div', ['weather-main-info']);
        const tempSpan = this.createElement('span', ['weather-temp'], `${Math.round(current.temperature_2m)}°`);
        
        const iconDesc = this.createElement('div', ['weather-icon-desc']);
        const iconSpan = this.createElement('span', ['material-symbols-outlined', 'weather-main-icon'], wmoInfo.icon);
        const descP = this.createElement('p', ['weather-desc'], wmoInfo.text);
        iconDesc.appendChild(iconSpan);
        iconDesc.appendChild(descP);

        mainInfo.appendChild(tempSpan);
        mainInfo.appendChild(iconDesc);

        // Detalles inferioores
        const details = this.createElement('div', ['weather-details']);
        
        // Humedad
        const detHum = this.createDetailBox('humidity_percentage', 'Humedad', `${current.relative_humidity_2m}%`);
        // Viento
        const detWind = this.createDetailBox('air', 'Viento', `${current.wind_speed_10m} km/h`);
        // Sensación
        const detApparent = this.createDetailBox('thermostat', 'Sensación', `${Math.round(current.apparent_temperature)}°`);

        details.appendChild(detHum);
        details.appendChild(detWind);
        details.appendChild(detApparent);

        // Apendemos todo
        container.appendChild(hdr);
        container.appendChild(mainInfo);
        container.appendChild(details);
    },

    createDetailBox: function(iconName, labelText, valueText) {
        const item = this.createElement('div', ['detail-item']);
        const wrapIcon = this.createElement('div', ['detail-icon-wrap']);
        const icon = this.createElement('span', ['material-symbols-outlined', 'detail-icon'], iconName);
        wrapIcon.appendChild(icon);

        const dataCont = this.createElement('div');
        const lbl = this.createElement('p', ['detail-label'], labelText);
        const val = this.createElement('p', ['detail-value'], valueText);
        dataCont.appendChild(lbl);
        dataCont.appendChild(val);

        item.appendChild(wrapIcon);
        item.appendChild(dataCont);
        return item;
    },

    /**
     * Renderiza proximas 24hs
     */
    renderHourlyForecast: function(container, weather) {
        this.clearContainer(container);
        
        const hourly = weather.hourly;
        // La IA nos devuelve un arreglo inmenso. Queremos de la hora actual en adelante (24 hr mode aprox 10 hs)
        // Pero el diseño pide algunas horas visualmente agradables.
        // Buscamos la hora actual
        const curTime = new Date();
        curTime.setMinutes(0, 0, 0); // Truncar a inicio de hora para comparar fácil con las de API
        
        let startIdx = 0;
        for (let i = 0; i < hourly.time.length; i++) {
            const rowDate = new Date(hourly.time[i]);
            if (rowDate >= curTime) {
                startIdx = i;
                break;
            }
        }

        // Mostrar unas 12 horas siguientes
        for (let i = startIdx; i < startIdx + 12; i++) {
            if(!hourly.time[i]) break;
            
            const timeDate = new Date(hourly.time[i]);
            const hourStr = timeDate.getHours().toString().padStart(2, '0') + ':00';
            
            const isHighlight = i === startIdx;
            
            const item = this.createElement('div', ['forecast-item']);
            if(isHighlight) item.classList.add('highlight');

            const pTime = this.createElement('p', ['fc-hour'], hourStr);
            
            // is_day se puede deducir asumiendo de 6 a 18 es dia. (No pasamos a la DB completa en este step para simplificar)
            // o mejor, la API open meteo tambien devuelve is_day, pero como no la pedi en el array hourly, uso fallback
            const isDayGuess = (timeDate.getHours() >= 6 && timeDate.getHours() < 19) ? 1 : 0;
            const wmo = this.getWmoInfo(hourly.weather_code[i], isDayGuess);

            const spanIcon = this.createElement('span', ['material-symbols-outlined', 'fc-icon'], wmo.icon);
            // coloreamos el icono segun sea sol(amarillo)
            if (wmo.icon.includes('sunny')) spanIcon.style.color = 'var(--color-yellow-dark)';
            else if (wmo.icon.includes('moon') || wmo.icon.includes('night') || wmo.icon.includes('bedtime')) spanIcon.style.color = 'var(--color-indigo)';
            else if (wmo.icon.includes('rain')) spanIcon.style.color = 'var(--color-blue-light)';
            else spanIcon.style.color = 'var(--color-slate-400)';

            const pTemp = this.createElement('p', ['fc-temp'], `${Math.round(hourly.temperature_2m[i])}°`);

            item.appendChild(pTime);
            item.appendChild(spanIcon);
            item.appendChild(pTemp);
            container.appendChild(item);
        }
    },

    /**
     * Render locations list Sidebar and Modal
     */
    renderSavedCitiesList: function(container, cities, onClickCallback, onDeleteCb = null) {
        this.clearContainer(container);
        if(cities.length === 0) {
            container.appendChild(this.createElement('p', [], 'No hay localidades guardadas.'));
            return;
        }

        cities.forEach(city => {
            if (onDeleteCb && container.id === 'modalSavedLocations') {
                // Modo listado de Modal, muestra boton borrar.
                const div = this.createElement('div', ['saved-city-item']);
                const spamName = this.createElement('span', ['saved-city-info'], `${city.name} (${city.country})`);
                spamName.addEventListener('click', () => onClickCallback(city));

                const delBtn = this.createElement('button', ['saved-city-delete']);
                const delIcon = this.createElement('span', ['material-symbols-outlined'], 'delete');
                delBtn.appendChild(delIcon);
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    onDeleteCb(city);
                });

                div.appendChild(spamName);
                div.appendChild(delBtn);
                container.appendChild(div);
            } else {
                // Modo Sidebar, tipo card
                const cd = this.createElement('div', ['glass-card', 'location-card']);
                cd.addEventListener('click', () => onClickCallback(city));
                
                const wrap = this.createElement('div', ['loc-info-wrap']);
                const icn = this.createElement('span', ['material-symbols-outlined', 'loc-icon'], 'location_city');
                icn.style.color = 'var(--color-primary)';
                
                const txtW = this.createElement('div');
                const pN = this.createElement('p', ['loc-name'], city.name);
                const pD = this.createElement('p', ['loc-desc'], city.country || 'Guardado');
                txtW.appendChild(pN);
                txtW.appendChild(pD);
                
                wrap.appendChild(icn);
                wrap.appendChild(txtW);

                const actionsWrap = this.createElement('div', ['loc-actions-wrap']);

                if (onDeleteCb) {
                    const delBtn = this.createElement('button', ['loc-delete-btn']);
                    const delIcon = this.createElement('span', ['material-symbols-outlined'], 'delete');
                    delBtn.appendChild(delIcon);
                    delBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        onDeleteCb(city);
                    });
                    actionsWrap.appendChild(delBtn);
                }

                const goI = this.createElement('span', ['material-symbols-outlined'], 'arrow_forward_ios');
                goI.style.color = 'var(--color-on-surface-variant)';
                actionsWrap.appendChild(goI);
                
                cd.appendChild(wrap);
                cd.appendChild(actionsWrap);
                
                container.appendChild(cd);
            }
        });
    },

    /**
     * Muestra mensaje global simple y asíncrono
     */
    showGlobalMessage: function(container, msg, isError = false) {
        this.clearContainer(container);
        const el = this.createElement('div', [], msg);
        el.style.padding = '1.6rem';
        el.style.borderRadius = 'var(--radius-lg)';
        el.style.backgroundColor = isError ? '#ffe4e6' : '#ecfdf5';
        el.style.color = isError ? '#be123c' : '#047857';
        el.style.marginBottom = '2.4rem';
        container.appendChild(el);
        setTimeout(() => this.clearContainer(container), 4000);
    },

    updateRadarLabel: function(cityName) {
        const label = document.getElementById('radarLabelText');
        if (label) {
            label.textContent = `Radar de ${cityName}`;
        }
    }
};
