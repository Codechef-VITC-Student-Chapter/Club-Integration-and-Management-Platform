export interface UserSignUpInfo {
  reg_number: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface UserLoginInfo {
  reg_number: string;
  password: string;
}

export interface TokenPayload {
  id: string;
  name: string;
  is_lead: boolean;
}

export interface CustomClaims {
  id: string;
  name: string;
  is_lead: boolean;
  iat?: number;
  exp?: number;
  iss?: string;
  sub?: string;
  aud?: string | string[];
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface SetNewPassInfo {
  reg_no: string;
  otp: string;
  password: string;
}
