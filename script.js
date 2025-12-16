document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "OpenWeather_APi_KEY";
  let clockInterval = null;

  const searchForm = document.getElementById("search-form");
  const cityInput = document.getElementById("city-input");
  const geolocationBtn = document.getElementById("geolocation-btn");
  const loadingOverlay = document.getElementById("loading-overlay");
  const weatherContent = document.getElementById("weather-content");
  const errorModal = document.getElementById("error-modal");
  const errorMessageEl = document.getElementById("error-message");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const animationContainer = document.getElementById("animation-container");
  const suggestionsBox = document.getElementById("suggestions-box");
  const cityNameEl = document.getElementById("city-name");
  const currentDateEl = document.getElementById("current-date");
  const currentTimeEl = document.getElementById("current-time");
  const currentTempEl = document.getElementById("current-temp");
  const currentWeatherDescEl = document.getElementById("current-weather-desc");
  const currentWeatherIconEl = document.getElementById("current-weather-icon");
  const forecastContainer = document.getElementById("forecast-container");
  const sunriseTimeEl = document.getElementById("sunrise-time");
  const sunsetTimeEl = document.getElementById("sunset-time");
  const humidityEl = document.getElementById("humidity");
  const windSpeedEl = document.getElementById("wind-speed");
  const feelsLikeEl = document.getElementById("feels-like");
  const pressureEl = document.getElementById("pressure");
  const visibilityEl = document.getElementById("visibility");
  const airQualityEl = document.getElementById("air-quality");
  const healthRecommendationsEl = document.getElementById(
    "health-recommendations"
  );

  const backgroundImageDay = {
    Clear:
      "https://images.unsplash.com/photo-1640888760062-731cf8fa1412?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    Clouds:
      "https://images.unsplash.com/photo-1566010503302-2564ae0d47b6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    Rain: "https://plus.unsplash.com/premium_photo-1664303017917-71ebeb42343d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=773",
    Drizzle:
      "https://images.unsplash.com/photo-1632487229379-ccf9c3bdeb53?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    Thunderstorm:
      "https://images.unsplash.com/photo-1595867005771-4d3e811d0886?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=812",
    Snow: "https://images.unsplash.com/photo-1457269449834-928af64c684d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
    Mist: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=874",
    Default:
      "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=775",
  };

  const backgroundImageNight = {
    Clear:
      "https://images.unsplash.com/photo-1727636681062-0c09b65bb858?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    Clouds:
      "https://images.unsplash.com/photo-1516166328576-82e16a127024?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    Rain: "https://images.unsplash.com/photo-1532349150739-cb439f9a34a3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    Drizzle:
      "https://images.unsplash.com/photo-1624756683696-a31aaec3ee9b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
    Thunderstorm:
      "https://plus.unsplash.com/premium_photo-1664298006973-e98eb94d006c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    Snow: "https://images.unsplash.com/photo-1542601098-8fc114e148e2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    Mist: "https://plus.unsplash.com/premium_photo-1711305682256-3b1874c923bd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    Default:
      "https://images.unsplash.com/photo-1615985765048-f3b2f7851c7b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=871",
  };
  
  const fetchweather = async ({ lat, lon, city }) => {
    showLoading();
    if (clockInterval) clearInterval(clockInterval);
    cityInput.value = "";
    cityInput.blur();

    try {
      if (!API_KEY) throw new Error("OpenWeatherMap API Key is missing.");
      let latitude = lat;
      let longitude = lon;

      if (city) {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        const getResponce = await fetch(geoUrl);
        if (!getResponce.ok)
          throw new Error(`Could not find location data for "${city}".`);
        const geoData = await getResponce.json();
        if (geoData.length === 0)
          throw new Error(`Could not find location data for "${city}".`);
        latitude = geoData[0].lat;
        longitude = geoData[0].lon;
      }

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

      const [weatherResponse, forecastResponse, aqiResponse] =
        await Promise.all([
          fetch(weatherUrl),
          fetch(forecastUrl),
          fetch(aqiUrl),
        ]);

      if (
        [weatherResponse, forecastResponse, aqiResponse].some((res) => !res.ok)
      ) {
        throw new Error(
          "Failed to fetch all weather data. Please check your API key and network connection."
        );
      }

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();
      const aqiData = await aqiResponse.json();

      updateUI(weatherData, forecastData, aqiData);
    } catch (error) {
      console.error("Weather data fetch error:", error);
      showError(error.message);
    } finally {
      hideLoading();
    }
  };

  const updateUI = (weather, forecast, aqi) => {
    let weatherCoditionForBg = weather.weather[0].main;
    if (weatherCoditionForBg === "Clouds" && weather.clouds.all < 20) {
      weatherCoditionForBg = "Clear";
    }
    updateClock(weather.timezone);
    clockInterval = setInterval(() => updateClock(weather.timezone), 1000);

    const currentTimeUTC = weather.dt;
    const sunriseUTC = weather.sys.sunrise;
    const sunsetUTC = weather.sys.sunset;

    const isNight = currentTimeUTC < sunriseUTC || currentTimeUTC > sunsetUTC;

    const backgroundSet = isNight ? backgroundImageNight : backgroundImageDay;
    document.body.style.backgroundImage = `url('${
      backgroundSet[weatherCoditionForBg] || backgroundSet.Default
    }')`;

    currentWeatherIconEl.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;

    cityNameEl.textContent = `${weather.name}, ${weather.sys.country}`;
    const localDate = new Date((weather.dt + weather.timezone) * 1000);
    currentDateEl.textContent = localDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
    currentTempEl.textContent = `${Math.round(weather.main.temp)}°`;
    currentWeatherDescEl.textContent = weather.weather[0].description;

    const formatTime = (timestamp) =>
      new Date(timestamp * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      });
    sunriseTimeEl.textContent = formatTime(
      weather.sys.sunrise + weather.timezone
    );
    sunsetTimeEl.textContent = formatTime(
      weather.sys.sunset + weather.timezone
    );

    humidityEl.textContent = `${weather.main.humidity} %`;
    windSpeedEl.textContent = `${(weather.wind.speed * 3.6).toFixed(1)} km/h`;
    feelsLikeEl.textContent = `${Math.round(weather.main.feels_like)}°`;
    pressureEl.textContent = `${weather.main.pressure} hPa`;
    visibilityEl.textContent = `${(weather.visibility / 1000).toFixed(1)} km`;

    const aqiValue = aqi.list[0].main.aqi;
    const aqiInfo = getAqiInfo(aqiValue);
    airQualityEl.textContent = aqiInfo.text;
    airQualityEl.className = `font-bold px-3 py-1 rounded-full text-sm ${aqiInfo.color}`;
    healthRecommendationsEl.innerHTML = `<p class="text-gray-200 text-sm">${aqiInfo.recommendation}</p>`;

    const dailyForecasts = processForecast(forecast.list);
    forecastContainer.innerHTML = " ";
    dailyForecasts.forEach((day) => {
      const card = document.createElement("div");
      card.className = `p-4 rounded-2xl text-center card backdrop-blur-xl`;
      card.innerHTML = `
        <p class="font-bold text-lg">${new Date(day.dt_txt).toLocaleDateString(
          "en-US",
          { weekday: "short" }
        )}</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}" class="w-16 h-16 mx-auto">
        <p class="font-semibold">${Math.round(day.main.temp_max)}°/${Math.round(
        day.main.temp_min
      )}°</p>
        `;
      forecastContainer.appendChild(card);
    });

    updateNightAnimation(isNight, weatherCoditionForBg);
  };

  const updateNightAnimation = (isNight, condition) => {
    animationContainer.innerHTML = "";
    if (!isNight) return;

    if (condition === "Clear") {
      for (let i = 0; i < 20; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        animationContainer.appendChild(star);
      }
    } else if (condition === "Rain" || condition === "Drizzle") {
      for (let i = 0; i < 50; i++) {
        const drop = document.createElement("div");
        drop.className = "rain-drop";
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
        animationContainer.appendChild(drop);
      }
    } else if (condition === "Snow") {
      for (let i = 0; i < 50; i++) {
        const flake = document.createElement("div");
        flake.className = "snowflake";
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDelay = `${Math.random() * 10}s`;
        flake.style.animationDuration = `${Math.random() * 5 + 5}s`;
        flake.style.opacity = `${Math.random() * 0.5 + 0.3}`;
        animationContainer.appendChild(flake);
      }
    }
  };

  const getAqiInfo = (aqi) => {
    switch (aqi) {
      case 1:
        return {
          text: "Good",
          color: "bg-green-500 text-white",
          recommendation:
            "Air quality is great. It's a perfect day to be active outside.",
        };
      case 2:
        return {
          text: "Fair",
          color: "bg-yellow-500 text-black",
          recommendation:
            "Air quality is acceptable. Unusually sensitive people should consider reducing prolonged or heavy exertion.",
        };
      case 3:
        return {
          text: "Moderate",
          color: "bg-orange-500 text-white",
          recommendation:
            "Sensitive groups may experience health effects. The general public is less likely to be affected.",
        };
      case 4:
        return {
          text: "Poor",
          color: "bg-red-500 text-white",
          recommendation:
            "Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects.",
        };
      case 5:
        return {
          text: "Very Poor",
          color: "bg-purple-700 text-white",
          recommendation:
            "Health alert: The risk of health effects is increased for everyone. Avoid outdoor activities.",
        };
      default:
        return {
          text: "Unknown",
          color: "bg-gray-500 text-white",
          recommendation: "Air quality data is not available at the moment.",
        };
    }
  };

  const processForecast = (forecastList) => {
    const dailyData = {};
    forecastList.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          temps_max: [],
          temps_min: [],
          icons: {},
          entry: null,
        };
      }
      dailyData[date].temps_max.push(entry.main.temp_max);
      dailyData[date].temps_min.push(entry.main.temp_min);
      const icon = entry.weather[0].icon;
      dailyData[date].icons[icon] = (dailyData[date].icons[icon] || 0) + 1;
      if (!dailyData[date].entry || entry.dt_txt.includes("12:00:00")) {
        dailyData[date].entry = entry;
      }
    });
    const processed = [];
    for (const date in dailyData) {
      const day = dailyData[date];
      const mostCommonIcon = Object.keys(day.icons).reduce((a, b) =>
        day.icons[a] > day.icons[b] ? a : b
      );
      day.entry.weather[0].icon = mostCommonIcon;
      day.entry.main.temp_max = Math.max(...day.temps_max);
      day.entry.main.temp_min = Math.min(...day.temps_min);
      processed.push(day.entry);
    }
    return processed.slice(0, 5);
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleCityInput = async (event) => {
    const query = event.target.value;
    if (query.length < 3) {
      suggestionsBox.classList.add("hidden");
      return;
    }
    try {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
      const responce = await fetch(geoUrl);
      if (!responce.ok) return;
      const cities = await responce.json();

      suggestionsBox.innerHTML = "";
      if (cities.length > 0) {
        suggestionsBox.classList.remove("hidden");
        cities.forEach((city) => {
          const div = document.createElement("div");
          div.className = "p-3 hover:bg-white/10 cursor-pointer";
          div.textContent = `${city.name}, ${
            city.state ? city.state + ", " : " "
          }${city.country}`;
          div.onclick = () => {
            cityInput.value = city.name;
            suggestionsBox.classList.add("hidden");
            fetchweather({ lat: city.lat, lon: city.lon });
          };

          suggestionsBox.appendChild(div);
        });
      } else {
        suggestionsBox.classList.add("hidden");
      }
    } catch (error) {
      console.error("Suggestion fetch error:", error);
    }
  };

  const updateClock = (timezoneOffset) => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + timezoneOffset * 1000);
    currentTimeEl.textContent = localTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const showLoading = () => {
    loadingOverlay.classList.remove("hidden");
    loadingOverlay.classList.add("flex");
  };

  const hideLoading = () => {
    loadingOverlay.classList.add("hidden");
    loadingOverlay.classList.remove("flex");
    weatherContent.classList.remove("opacity-0");
  };

  const showError = (message) => {
    errorMessageEl.textContent = message;
    errorModal.classList.remove("hidden");
  };

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) fetchweather({ city });
    suggestionsBox.classList.add("hidden");
    cityInput.value = "";
  });

  cityInput.addEventListener("input", debounce(handleCityInput, 300));
  document.addEventListener("click", (e) => {
    if (!searchForm.contains(e.target)) {
      suggestionsBox.classList.add("hidden");
    }
  });
  geolocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          fetchweather({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }),
        () => {
          console.log(
            "Geolocation failed or was denied. Falling back to default city."
          );
          fetchweather({ city: "Mumbai" });
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
      );
    } else {
      console.log("Geolocation not supported. Falling back to default city.");
      fetchweather({ city: "Mumbai" });
    }
  });

  closeModalBtn.addEventListener("click", () =>
    errorModal.classList.add("hidden")
  );

  geolocationBtn.click();
});
