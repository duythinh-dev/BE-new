export const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
export const JWT_EXPIRES_IN = "15m";
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "supersecretrefresh";
export const JWT_REFRESH_EXPIRES_IN = "7d";
