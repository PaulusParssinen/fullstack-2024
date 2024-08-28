import { useState } from "react";
import CountryDetails from "./CountryDetails";

const CountryEntry = ({ country }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div>
        {country.name.common}
        <button onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
      </div>
      {show && <CountryDetails country={country} />}
    </>
  );
};

const Results = ({ countries }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />;
  }

  return (
    <>
      {countries.map((country) => (
        <CountryEntry key={country.cca3} country={country} />
      ))}
    </>
  );
};

export default Results;
