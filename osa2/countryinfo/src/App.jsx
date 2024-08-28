import { useEffect, useState } from "react";

import getAll from "./services/countries";
import Results from "./components/Results";

export const App = () => {
  const [filter, setFilter] = useState("");
  const [countries, setCountries] = useState([]);

  // Fetch all countries from the API for in-memory filtering
  useEffect(() => {
    getAll().then((countries) => setCountries(countries));
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toUpperCase().includes(filter.toUpperCase())
  );

  return (
    <>
      <div>
        find countries{" "}
        <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      {filter && <Results countries={filteredCountries} />}
    </>
  );
};

export default App;
