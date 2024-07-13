export const base64 = {
  decode: (input: string) => Buffer.from(input, "base64").toString("utf-8"),
  encode: (input: string) => Buffer.from(input).toString("base64"),
};
