export type AccessTokenPayload = {
  id: string;
  name: string;
  username: string;
  roles: string[];
  impersonated?: string;
  use: 'api' | 'session';
};

export type RefreshTokenPayload = {
  username: string;
};

export type AccessToken = AccessTokenPayload & {
  jti: string;
};

export type RefreshToken = RefreshTokenPayload & {
  jti: string;
};
