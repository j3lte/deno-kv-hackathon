import { getMaxDecryptAttempts, getMaxSecretLength } from "./util.ts";

export const APP_NAME = "Exchange Secrets";

export const KV_SET = {
  USERS: "users",
  USERS_BY_LOGIN: "users_by_login",
  USERS_BY_SESSION: "users_by_session",
  USERS_BY_LAST_SIGNIN: "users_by_last_signin",
  SECRETS: "secrets",
  SECRETS_BY_USER: "secrets_by_user",
};

export const MAX_SECRET_SIZE = getMaxSecretLength();
export const MAX_DECRYPT_ATTEMPTS = getMaxDecryptAttempts();
