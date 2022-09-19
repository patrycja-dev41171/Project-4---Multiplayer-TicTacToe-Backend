export type Login = {
  email: string;
  password: string;
};

export interface LoginEntity {
  user_id: string;
  refreshToken: string;
}

export interface LoginDataCreated {
  user_id: string;
  token: string;
  refreshToken: string;
}
