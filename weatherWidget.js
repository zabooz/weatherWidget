const config = {
  targetId: "weatherWidgetDiv",
  lat: 46.6357,
  lng: 14.311817,
  apiKey: "96fe2517f425092a3ad95905aa85bd71",
  URL: "https://api.openweathermap.org/data/2.5/weather",
  refreshTime: 300000,
  locations: [
    {
      name: "Klagenfurt",
      lat: 46.6357,
      lng: 14.311817,
    },
    {
      name: "London",
      lat: 51.5074,
      lng: 0.1278,
    },
    {
      name: "New York",
      lat: 40.7128,
      lng: -74.006,
    },
    {
      name: "Tokyo",
      lat: 35.6895,
      lng: 139.6917,
    },
  ],
};

const weatherWidget = {
  execute: (config) => {
    const loadWidget = () => {
      weatherWidget.getWeatherData(config).then((data) => {
        weatherWidget.createLayout();
        weatherWidget.createWeatherDescription(data);
        weatherWidget.createData(data);
        weatherWidget.createLocationButton();
      });
    };

    loadWidget();

    setInterval(loadWidget, config.refreshTime);
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
      throw error;
    }
  },
  createLayout: () => {
    const target = document.getElementById(config.targetId);

    target.innerHTML = "";

    const main = document.createElement("div");
    main.id = "weatherWidgetMain";
    main.classList.add("uk-flex");


    const iconDiv = document.createElement("div");
    iconDiv.id = "iconDiv";

    const dataDiv = document.createElement("div");
    dataDiv.id = "dataDiv";
    dataDiv.classList.add("uk-grid", "uk-grid-medium", "uk-flex-column");

    main.append(iconDiv, dataDiv);

    iconDiv.classList.add("uk-flex", "uk-flex-column", "uk-width-2-3");
    target.append(main);
  },
  createWeatherDescription: (data) => {
    const iconDiv = document.getElementById("iconDiv");

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
    locationDate.classList.add(
      "uk-grid",
      "uk-flex-column",
      "uk-margin-small-top"
    );

    //StadtName und Region
    const cityName = document.createElement("p");
    cityName.classList.add("uk-text-left");
    cityName.innerText = data.name;

    const regionPara = document.createElement("p");
    regionPara.classList.add("uk-text-left");
    const regionIcon = document.createElement("span");
    regionIcon.setAttribute("uk-icon", "location");
    regionIcon.setAttribute("ratio", "0.8")
    regionPara.append(regionIcon);
    const regionID = data.sys.country;
    let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
   
    regionPara.append(document.createTextNode(` ${regionNames.of(regionID)}`))
    

    //wochentag
    const today = new Date();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const day = document.createElement("p");
    day.classList.add("uk-text-left");
    const dayIcon = document.createElement("span");
    dayIcon.setAttribute("uk-icon", "calendar");
    dayIcon.setAttribute("ratio", "0.8")
    day.append(dayIcon);
    day.append(document.createTextNode("" + dayNames[today.getDay()]));

    locationDate.append(cityName, regionPara, day);

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
    const tempPara = document.createElement("p");
    const tempIcon = document.createElement("i");
    tempIcon.classList.add("wi", "wi-thermometer");
    tempPara.append(tempIcon);
    tempPara.appendChild(document.createTextNode(" Temperature: " + tempCelsius.toFixed(1) + "°C"));
    

    //Luftfeuchtigkeit
    const humidity = data.main.humidity;
    const humidityPara = document.createElement("p");
    const humidityIcon = document.createElement("i");
    humidityIcon.classList.add("wi", "wi-humidity");
    humidityPara.append(humidityIcon);
    humidityPara.appendChild(document.createTextNode(" Humidity: " + humidity + "%"));
   

    //Windgeschwindigkeit
    const windSpeed = data.wind.speed;
    const windSpeedPara = document.createElement("p");
    const windIcon = document.createElement("i");
    windIcon.classList.add("wi", "wi-wind");

    windSpeedPara.append(windIcon);
    windSpeedPara.appendChild(document.createTextNode("  Wind: " + windSpeed + " m/s"))

    weatherData.append(tempPara, humidityPara, windSpeedPara);

    return weatherData;
  },

  createLocationButton: () => {

    const target = document.getElementById(config.targetId);

    const locationButton = document.createElement("button");
    locationButton.innerText = "Change Location";
    locationButton.classList.add("uk-button", "uk-button-primary");
    locationButton.addEventListener("click", () => {
      const cleanLocationArr = config.locations.filter(
        (location) => location.lat !== config.lat && location.lng !== config.lng
      );
      const randomLocation =
      cleanLocationArr[Math.floor(Math.random() * cleanLocationArr.length)];
      config.lat = randomLocation.lat;
      config.lng = randomLocation.lng;
      weatherWidget.execute(config);
    });

    target.append(locationButton);
  },
};
