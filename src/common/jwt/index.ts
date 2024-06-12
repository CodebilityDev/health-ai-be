import jwt, { SignOptions } from "jsonwebtoken";
import { CONFIG } from "../../utils/config/env";

export async function jwt_sign(
  data: Record<string, any>,
  options: SignOptions,
) {
  const token = jwt.sign(data, CONFIG.JWT_SECRET, options);

  return token;
}

export async function jwt_verify(token: string) {
  const data = jwt.verify(token, CONFIG.JWT_SECRET);

  return data;
}
