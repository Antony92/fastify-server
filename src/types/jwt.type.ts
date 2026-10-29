export type AccessToken = {
  jti: string;
  id: string;
  name: string;
  username: string;
  type: 'access' | 'refresh';
  roles: string[];
  impersonated?: string;
};
