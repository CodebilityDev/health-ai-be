export interface IUserJwt {
  id: string;
  name: string;
  email: string;
  role: string;
  type: "auth" | "reset-password";
  createdAt: Date;
}

export interface IChangePassword {
  oldPassword: string;

  newPassword: string;
}
