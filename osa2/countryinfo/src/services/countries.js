import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const getCountries = () =>
  axios.get(`${baseUrl}/all`).then((response) => response.data);

export default getCountries;
