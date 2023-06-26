 var apiKey = '972c2caf5b4942026f2bc59c4f48d78f'

var searchInputEl = document.getElementById("search-input");
var searchButtonEl = document.getElementById("searchBtn");
var cityNameEl = document.getElementById("cityName");
var cityHistoryEl = document.getElementById("city-history")

var indexs = [0,7,15,23,31,39];

// Use geofinder for lat and long

var tempEls = [
    document.getElementById("tempDay"), 
    document.getElementById("tempDay1"),
    document.getElementById("tempDay2"),
    document.getElementById("tempDay3"),
    document.getElementById("tempDay4"),
    document.getElementById("tempDay5"),
  ];

  var cityDayEl = [
    document.getElementById("dayForecast"),
    document.getElementById("dayForecast1"),
    document.getElementById("dayForecast2"),
    document.getElementById("dayForecast3"),
    document.getElementById("dayForecast4"),
    document.getElementById("dayForecast5"),
  ];
  

var humidEls = [
    document.getElementById("humidityDay"), 
    document.getElementById("humidityDay1"),
    document.getElementById("humidityDay2"),
    document.getElementById("humidityDay3"),
    document.getElementById("humidityDay4"),
    document.getElementById("humidityDay5")
  ];

  var windEls = [
    document.getElementById("windDay"), 
    document.getElementById("windDay1"),
    document.getElementById("windDay2"),
    document.getElementById("windDay3"),
    document.getElementById("windDay4"),
    document.getElementById("windDay5")
  ];

  var weatherDisplayEl = document.getElementById("displayweather");

  var cities=[];
  var city_history=[];
  var temps=[6];
  var humidity=[6];
  var winds = [6];
  var dates = [6];

  function getLocation(city) {
    var locationUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;
    fetch(locationUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      console.log(response[0]);
      console.log(response[0].name);
      var lat = response [0].lat;
      var lon = response [0].lon;
      getWeather(lat, lon)
    });
  }

  function getWeather(lat, lon) {
    var weatherUrl =   "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&units=metric"+"&lang=english"+"&appid="+apiKey;
    fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      displayWeather(response);
    });
  }

  function displayWeather(response) {
    console.log(response);
    var city = response.city.name;
    cityHistoryEl.textContent = "";

    for (var i=0;i<6;i++) {
      temps[i] = response.list[indexs[i]].main.temp;
      humidity[i] = response.list[indexs[i]].main.humidity;
      winds[i] = response.list[indexs[i]].wind.speed;
      dates[i] = new Date(response.list[indexs[i]].dt * 1000);
    }

    for (var i=0; i<5; i++){
      cities.push(response.list[i]);
    }

    for (var j=0;j<6;j++) {
      tempEls[j].textContent = "Tempature " + temps[j] + "C";
      windEls[j].textContent = "Wind Speed: " + winds[j] + "KM/H";
      humidEls[j].textContent = "Humidity: " + humidity[j] + "%"; 
      cityDayEl[j].textContent = "City Day: " + city + " " + dates[j].toLocaleString()
    }
  }

  searchButtonEl.addEventListener("click", function () {
    var searchInput = searchInputEl.value; 
    getLocation(searchInput);
    // Add the user's search input to the "city_history" array and update the city history on the page
    if (city_history.length<3){
    console.log(city_history);
    city_history.unshift(searchInput);
    console.log(city_history);
    } else{
      city_history.length= city_history.length-1;
      city_history.unshift(searchInput);
    }
    printCityHistory();
    updateCityHistory(city_history);
  });

  var city_history = JSON.parse(localStorage.getItem("city_history")) || [];

// This function prints the city history on the page, with each city as a button that can be clicked to retrieve the weather data
function printCityHistory() {
  cityHistoryEl.innerHTML = "";
  console.log(cityHistoryEl);
  for (let i = 0; i < city_history.length; i++) {
    const list = document.createElement("li");
    list.setAttribute("id",city_history[i]);
    cityHistoryEl.appendChild(list);
    const container = document.getElementById(city_history[i]);
    const button = document.createElement("button");
    button.setAttribute("value",city_history[i]);
    button.textContent = city_history[i];
    container.appendChild(button);
    button.addEventListener("click", function(event){
    const city = event.target.value;
    console.log(city);
    getLocation(city);
    })
  }
}
// This function updates the city history in local storage with the user's search input and calls the "printCityHistory" function to update the city history on the page
function updateCityHistory(searchInput) {
  localStorage.setItem("city_history", JSON.stringify(searchInput));
  printCityHistory();
}
// Load city history on page load
printCityHistory();

