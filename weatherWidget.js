const config = {
  targetId: "weatherWidgetDiv",
  lat: 46.6357,
  lng: 14.311817,
  apiKey: "96fe2517f425092a3ad95905aa85bd71",
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
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${config.lat}&lon=${config.lng}&appid=${config.apiKey}`;
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

    // dataDiv.classList.add(
    //   "uk-flex",
    //   "uk-flex-column",
    //   "flex-align-left",
    //   "uk-margin-remove",
    //   "uk-width-1-1"
    // );
    main.append(iconDiv, dataDiv);
    target.append(main);
  },
  createWeatherDescription: (data) => {
    const iconDiv = document.getElementById("iconDiv");

    const iconId = data.weather[0].icon;

    iconDiv.classList.add("uk-flex", "uk-flex-column", "uk-width-1-1");

    const icon = document.createElement("img");
    icon.style.width = "200px";
    icon.src = `https://openweathermap.org/img/w/${iconId}.png`;

    const para = document.createElement("p");
    para.classList.add("uk-text-left", "uk-padding-small", "uk-margin-remove");
    para.innerText = data.weather[0].description;
    iconDiv.append(para, icon);
  },
  createData: (data) => {
    const dataDiv = document.getElementById("dataDiv");

    const locationDate = document.createElement("div");
    locationDate.id = "locationDate";
    locationDate.classList.add("uk-flex", "uk-flex-column");
    locationDate.classList.add("uk-grid", "uk-margin-small-top");

    const cityName = document.createElement("p");
    cityName.classList.add("uk-text-left");
    cityName.innerText = data.name;

    const regionID = data.sys.country;
    let regionNames = new Intl.DisplayNames(["en"], { type: "region" });

    const region = document.createElement("p");
    region.classList.add("uk-text-left");
    region.innerText = regionNames.of(regionID);

    const day = document.createElement("p");
    day.classList.add("uk-text-left");
    day.innerText = "Monday";

    locationDate.append(cityName, region, day);


    const weatherData = document.createElement("div");
    weatherData.id = "weatherData";
    weatherData.classList.add("uk-grid", "uk-flex-column", "uk-margin-small-top");


    const tempCelsius = data.main.temp - 273.15;
    const temp = document.createElement("p");
    temp.classList.add("uk-text-left");
    temp.innerText = tempCelsius.toFixed(1) + "°C";



    const humidity = data.main.humidity;
    const humidityPara = document.createElement("p");
    humidityPara.classList.add("uk-text-left");
    humidityPara.innerText = "Humidity: " + humidity + "%";

    const windSpeed = data.wind.speed;
    const windSpeedPara = document.createElement("p");
    windSpeedPara.classList.add("uk-text-left");
    windSpeedPara.innerText = "Wind: " + windSpeed + " m/s";

    weatherData.append(temp,humidityPara,windSpeedPara);



    dataDiv.append(locationDate, weatherData);
  },
};
