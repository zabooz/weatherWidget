const config = {
  targetId: "weatherWidgetDiv",
  lat: 46.6357,
  lng: 14.311817,
  apiKey: "96fe2517f425092a3ad95905aa85bd71",
  URL: "https://api.openweathermap.org/data/2.5/weather",
};

const weatherWidget = {
  execute: (config) => {
    weatherWidget.createLayout();
    weatherWidget.getWeatherData(config).then((data) => {
      weatherWidget.createWeatherDescription(data);
      weatherWidget.createData(data);
    });
  },

  getWeatherData: async function (config) {
    try {
      const apiUrl = `${config.URL}?lat=${config.lat}&lon=${config.lng}&appid=${config.apiKey}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("error");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  },
  createLayout: () => {
    const target = document.getElementById(config.targetId);

    const main = document.createElement("div");
    main.id = "weatherWidgetMain";

    main.style.backgroundColor = "lightblue";

    main.classList.add("uk-flex");
    main.style.width = "500px";

    const iconDiv = document.createElement("div");
    iconDiv.id = "iconDiv";

    const dataDiv = document.createElement("div");
    dataDiv.id = "dataDiv";

    dataDiv.classList.add("uk-grid", "uk-grid-medium");

    main.append(iconDiv, dataDiv);
    target.append(main);
  },
  createWeatherDescription: (data) => {

    const iconDiv = document.getElementById("iconDiv");
    iconDiv.classList.add("uk-flex", "uk-flex-column",'uk-width-2-3');

    const icon = document.createElement("img");
  
    icon.style.width = "200px";
    const iconId = data.weather[0].icon;
    icon.src = `https://openweathermap.org/img/w/${iconId}.png`;

    const para = document.createElement("p");
    para.classList.add("uk-text-left", "uk-padding-small", "uk-margin-remove");
    para.innerText = data.weather[0].description;
    iconDiv.append(para, icon);
  },
  createData: (data) => {
    const dataDiv = document.getElementById("dataDiv");

    const locationDate = weatherWidget.locationAndDate(data);
    const weatherData = weatherWidget.weatherData(data);

    dataDiv.append(locationDate, weatherData);
  },
  locationAndDate: (data) => {
    const locationDate = document.createElement("div");
    locationDate.id = "locationDate";
    locationDate.classList.add("uk-grid", "uk-flex-column", "uk-margin-medium-top");

    //StadtName und Region
    const cityName = document.createElement("p");
    cityName.classList.add("uk-text-left");
    cityName.innerText = data.name;

    const region = document.createElement("p");
    region.classList.add("uk-text-left");

    const regionID = data.sys.country;
    let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    region.innerText = regionNames.of(regionID);

    //wochentag
    const today = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const day = document.createElement("p");
    day.classList.add("uk-text-left");
    day.innerText = dayNames[today.getDay()];

    locationDate.append(cityName, region, day);

    return locationDate;
  },
  weatherData: (data) => {
    const weatherData = document.createElement("div");
    weatherData.id = "weatherData";
    weatherData.classList.add(
      "uk-grid",
      "uk-flex-column",
      "uk-margin-small-top"
    );

    //Temperatur
    const tempCelsius = data.main.temp - 273.15;
    const temp = document.createElement("p");
    temp.classList.add("uk-text-left");
    temp.innerText = tempCelsius.toFixed(1) + "°C";

    //Luftfeuchtigkeit
    const humidity = data.main.humidity;
    const humidityPara = document.createElement("p");
    humidityPara.classList.add("uk-text-left");
    humidityPara.innerText = "Humidity: " + humidity + "%";

    //Windgeschwindigkeit
    const windSpeed = data.wind.speed;
    const windSpeedPara = document.createElement("p");
    windSpeedPara.classList.add("uk-text-left");
    windSpeedPara.innerText = "Wind: " + windSpeed + " m/s";

    weatherData.append(temp, humidityPara, windSpeedPara);

    return weatherData;
  },
};
