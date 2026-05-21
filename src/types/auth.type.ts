export type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type VerifyEmailForm = {
  email: string;
  code: string;
};

export type ResendCodeForm = {
  email: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  fullName?: string;
  email: string;
  role?: "admin" | "user";
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser | null;
  name?: string;
  fullName?: string;
  role?: "admin" | "user";
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthSession = AuthTokens & {
  user: AuthUser | null;
  userEmail: string;
};

export type RefreshResponse = {
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
};
