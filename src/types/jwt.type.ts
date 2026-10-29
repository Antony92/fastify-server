export type AccessToken = {
  id: string;
  name: string;
  username: string;
  roles: string[];
  impersonated?: string;
};

export type RefreshToken = {
  username: string;
  type: 'access' | 'refresh';
  roles: string[];
  impersonated?: string;
};
