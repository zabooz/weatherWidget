const config = {
  targetId: "weatherWidgetDiv",
  lat: 42.123,
  lng: 11.213,
  CityName: "Klagenfurt",
  apiKey : "96fe2517f425092a3ad95905aa85bd71"
};

const weatherWidget = {
  execute: (config) => {
      weatherWidget.getWeatherData(config).then((data) => {
          console.log(data);
        });

        
        
        weatherWidget.createLayout()
        weatherWidget.createIcon(config)
        weatherWidget.createData(config)
  },

  getWeatherData: async function (config) {

        try{
            const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${config.lat}&lon=${config.lng}&appid=${config.apiKey}`;
            const response = await fetch(apiUrl)
            
            if (!response.ok) {
                throw new Error('error');
            }
            const data = await response.json();
            return data

        }catch(error){
            console.error('error', error);
            throw error;
        }

  },
  createLayout: () => {
    const target = document.getElementById(config.targetId);


    const main = document.createElement("div");
    main.id = "weatherWidgetMain";

    main.style.backgroundColor = "lightblue";

    main.classList.add('uk-flex')
    main.style.width = '500px'

    const iconDiv = document.createElement("div");
    iconDiv.id = "iconDiv";

    const dataDiv = document.createElement("div");
    dataDiv.id = "dataDiv";

    main.append(iconDiv, dataDiv);
    target.append(main);
    
  },
  createIcon: (config) => {
   
        const iconDiv = document.getElementById("iconDiv");
    
        iconDiv.classList.add('uk-flex','uk-flex-column','uk-width-1-1');
    
    

        const icon = document.createElement("i");
        icon.style.fontSize = "5em";
        icon.classList.add("wi", "wi-day-sunny", "uk-align-center");
        
      
        const para = document.createElement("p");
        para.classList.add('uk-text-left','uk-padding-small','uk-margin-remove');
        para.innerText = 'dummyText';
  
        iconDiv.append(para,icon);
    
    },
    createData: (config, data) => {
        const dataDiv = document.getElementById("dataDiv");
        dataDiv.classList.add('uk-flex', 'uk-flex-column', 'flex-align-left', 'uk-margin-remove','uk-width-1-1');
        

        const locationDate = document.createElement("div");
        locationDate.classList.add('uk-flex', 'uk-flex-column');
        locationDate.classList.add('uk-grid', 'uk-margin-small-top');  
        
        const day = document.createElement("p");
        day.classList.add('uk-text-left');
        day.innerText = 'Monday';

        const cityName = document.createElement("p");
        cityName.classList.add('uk-text-left');
        cityName.innerText = config.CityName + ', Österreich'

        locationDate.append(cityName,day);

        const tempDiv = document.createElement("div");
        tempDiv.classList.add('uk-flex', 'uk-flex-column', 'uk-margin-small-top');

        const temp = document.createElement("p");
        temp.classList.add('uk-text-left')
        temp.innerText = '34 C';

    
        dataDiv.append(locationDate,temp);
      },
    

};
