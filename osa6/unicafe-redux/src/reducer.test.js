import deepFreeze from "deep-freeze";
import counterReducer from "./reducer";

const initialState = {
  good: 0,
  ok: 0,
  bad: 0,
};

describe("unicafe reducer", () => {
  test("returns the initial state when called with UNDEFINED action", () => {
    const action = {
      type: "UNDEFINED",
    };

    const newState = counterReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test("good is incremented", () => {
    const action = {
      type: "GOOD",
    };
    const state = initialState;

    deepFreeze(state);
    const newState = counterReducer(state, action);

    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0,
    });
  });

  test("ok is incremented", () => {
    const action = {
      type: "OK",
    };
    const state = initialState;

    deepFreeze(state);
    const newState = counterReducer(state, action);

    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0,
    });
  });

  test("bad is incremented", () => {
    const action = {
      type: "BAD",
    };
    const state = initialState;

    deepFreeze(state);
    const newState = counterReducer(state, action);

    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1,
    });
  });

  test("ZERO resets the state", () => {
    const state = {
      good: 5,
      ok: 3,
      bad: 2,
    };
    const action = {
      type: "ZERO",
    };

    deepFreeze(state);
    const newState = counterReducer(state, action);

    expect(newState).toEqual(initialState);
  });
});
