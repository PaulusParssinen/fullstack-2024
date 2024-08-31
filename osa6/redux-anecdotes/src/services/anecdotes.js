import axios from "axios";

const baseUrl = "http://localhost:3301/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (content) => {
  const response = await axios.post(baseUrl, { content, votes: 0 });
  return response.data;
};

const update = async (id) => {
  const currentResponse = await axios.get(`${baseUrl}/${id}`);

  const anecdote = currentResponse.data;
  const updateResponse = await axios.put(`${baseUrl}/${id}`, {
    ...anecdote,
    votes: anecdote.votes + 1,
  });

  return updateResponse.data;
};

export default { getAll, createNew, update };
