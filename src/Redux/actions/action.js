export const login = ({ username, password }) => {
  return async (dispatch, getState) => {
    const options = {
      url: baseUrl + "/auth",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        email: username,
        password: password,
      },
    };

    Axios(options)
      .then((response) => {
        toast.success("Successfuly signed in");
        window.localStorage.setItem("accessToken", response.data.authorization);

        Router.push("/dashboard");
        dispatch({ type: "NOTLOADING" });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Invalid username and password");
        dispatch({ type: "NOTLOADING" });
      });
  };
};
