export enum AuthType {
  Basic,
  Bearer,
  ClientCredential,
  X509Certificate,
  None,
}

export interface AppCredentials {
  authType?: AuthType;
  username?: string;
  password?: string;
  loginHintOrigin?: string;
  clientId?: string;
  clientSecret?: string;
  cfServiceLabel?: string;
}
