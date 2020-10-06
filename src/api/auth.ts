import { LoginCredentialType } from "paygo";

export const login = (credential: LoginCredentialType) => {
  if (credential.phone === "08063339329" || credential.password === "123456") {
    return Promise.resolve();
  }

  return Promise.reject();
};
