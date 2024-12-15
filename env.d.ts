declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET_KEY_TOTP: string;
    }
  }
}

export {};
