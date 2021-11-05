const initialState = {
  name: "Emmanuel Nwanochie",
  user: [],

  // all loading states
  isLoading: false,
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        isLoading: true,
      };
    case "NOTLOADING":
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
