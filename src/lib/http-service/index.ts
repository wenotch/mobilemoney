import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ErrorType } from "paygo";
import { baseUrl } from "../../constants";
import { convertUrlStringToArray, getToken } from "../utils";

const publicRoutes = [
  "auth",
  "users",
  "reset_password",
  "verify",
  "change_password_with_code",
];

axios.interceptors.request.use(async (config: AxiosRequestConfig) => {
  config.baseURL = baseUrl;
  const token = await getToken();
  const urlArray = convertUrlStringToArray(config.url!);
  const last = urlArray.pop();

  if (publicRoutes.indexOf(last!) > 0) {
    return config;
  }

  config.headers = { ...config.headers, Authorization: token };

  return config;
});

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (err: AxiosError<ErrorType>) => {
    let error = new Error();

    if (err.message.toLocaleLowerCase() === "network error") {
      error.message = "Your internet connection is not stable.";
      error.name = "network_error";
    }

    if (err.response?.status === 500) {
      error.name = "internal_server_error";
      error.message =
        "We can not process your request at this time. Please try again later";
    }

    if (err.response?.status === 502) {
      error.name = "gateway_error";
      error.message = err.response?.data.message;
    }

    if (err.response?.status! >= 400 || err.response?.status! < 500) {
      error.name = err.response?.data.status!;

      try {
        error.message = JSON.parse(err.response?.data.message!).message;
      } catch (e) {
        error.message = err.response?.data.message!;
      }
    }

    throw error;
  }
);

export const HttpService = axios;
