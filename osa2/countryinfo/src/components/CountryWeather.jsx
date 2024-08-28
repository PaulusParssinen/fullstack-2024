import { useEffect, useState } from "react";
import getWeather from "../services/weather";

const CountryWeather = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    getWeather(country.name.common).then((data) => setWeather(data));
  }, [country]);

  const iconUrl = `https://openweathermap.org/img/w/${weather?.weather[0].icon}.png`;

  return weather ? (
    <>
      <h3>Weather in {country.capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <p>wind {weather.wind.speed} m/s</p>
    </>
  ) : (
    <p>Loading weather data...</p>
  );
};

export default CountryWeather;
