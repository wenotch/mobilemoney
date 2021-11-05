import Axios from "axios";
import toast from "react-hot-toast";
import { Redirect, useHistory } from "react-router";
import history from "../../history";

//enpoint base Url
const baseUrl = "https://paygo.gitit-tech.com";

export const login = (userData) => {
  return async (dispatch, getState) => {
    const options = {
      url: baseUrl + "/auth",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: userData,
    };

    Axios(options)
      .then((response) => {
        window.localStorage.setItem("accessToken", response.data.authorization);
        history.push("/dashboard");
        dispatch({ type: "NOTLOADING" });
      })
      .catch((error) => {
        toast.error("Invalid username and password");
        dispatch({ type: "NOTLOADING" });
      });
  };
};
