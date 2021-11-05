const initialState = {
  name: "Emmanuel Nwanochie",
  user: [],
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BLOCK":
      return {
        ...state,
      };

    default:
      return state;
  }
};
