import CountryWeather from "./CountryWeather";

const CountryDetails = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>capital {country.capital}</p>
    <p>area {country.area}</p>
    <h3>languages</h3>
    <ul>
      {Object.entries(country.languages).map(([code, lang]) => (
        <li key={code}>{lang}</li>
      ))}
    </ul>
    <img src={country.flags.png} />
    <CountryWeather country={country} />
  </div>
);

export default CountryDetails;
