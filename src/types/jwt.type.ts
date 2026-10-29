export type AccessToken = {
  jti: string;
  id: string;
  name: string;
  username: string;
  roles: string[];
  impersonated?: string;
};

export type RefreshToken = {
  jti: string;
  username: string;
};
