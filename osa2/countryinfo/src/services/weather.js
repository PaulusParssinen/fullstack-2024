import axios from "axios";

const baseUrl = "https://api.openweathermap.org/data/2.5";
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const getWeather = (query) =>
  axios
    .get(`${baseUrl}/weather?q=${query}&APPID=${apiKey}&units=metric`)
    .then((response) => response.data);

export default getWeather;
