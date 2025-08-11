export interface LoginFormValues {
  id: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    role: 'CUSTOMER' | 'HELPER';
  };
}
