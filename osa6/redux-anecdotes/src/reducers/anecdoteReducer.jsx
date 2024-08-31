import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    voteAnecdote: (state, action) => {
      const id = action.payload.id;

      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : action.payload
      );
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes: (_state, action) => action.payload,
  },
});

export const { voteAnecdote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

export const initAnecdotes = () => async (dispatch) => {
  const anecdotes = await anecdoteService.getAll();

  dispatch(setAnecdotes(anecdotes));
};

export const createAnecdote = (content) => async (dispatch) => {
  const newAnecdote = await anecdoteService.createNew(content);

  dispatch(appendAnecdote(newAnecdote));
};

export const voteForAnecdote = (anecdote) => async (dispatch) => {
  const updatedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1,
  };
  const savedAnecdote = await anecdoteService.update(
    anecdote.id,
    updatedAnecdote
  );
  dispatch(voteAnecdote(savedAnecdote));
};

export default anecdoteSlice.reducer;
