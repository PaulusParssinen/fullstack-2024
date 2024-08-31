import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { message: "" },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    removeMessage: (state) => {
      state.message = "";
    },
  },
});

export const { setMessage, removeMessage } = notificationSlice.actions;

export const setNotification = (message, time) => async (dispatch) => {
  dispatch(setMessage(message));

  setTimeout(() => {
    dispatch(removeMessage());
  }, time * 1000);
};

export default notificationSlice.reducer;
