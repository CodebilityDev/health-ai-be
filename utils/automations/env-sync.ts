import { readFileSync, writeFileSync } from "fs";

import { join } from "path";

// read .env file, keep all lines as it is, with only the values being obfuscated
const envFile = readFileSync(join(__dirname, "..", "..", ".env"));

// if env file is not found, throw an error
if (!envFile) {
  throw new Error("No env file found");
}

// obfuscate the values
const envVars = envFile
  .toString()
  .split("\n")
  .filter((line) => {
    if (line.startsWith("#")) {
      return true;
    }
    const [key, value] = line.split("=");
    if (key && value) {
      return true;
    }
    return false;
  })
  // sort by alphabetical order key
  .sort((a, b) => {
    const [keyA] = a.split("=");
    const [keyB] = b.split("=");
    return keyA.localeCompare(keyB);
  })
  .map((line) => {
    if (line.startsWith("#")) {
      return line;
    }
    const [key, value] = line.split("=");
    // if VALUE exists in actual # VALUE, use that, else use the value from the .env file
    let [, recommendedValue] = value.split("#");
    // strip whitespace from VALUE
    recommendedValue = (recommendedValue ?? "").trim();
    return (
      `${key}=${recommendedValue}` +
      (recommendedValue ? ` # ${recommendedValue}` : "")
    );
  });

// write the obfuscated env file
const obfuscatedEnvFile = envVars.join("\n");

// write the obfuscated env file
writeFileSync(join(__dirname, "..", "..", ".env.sample"), obfuscatedEnvFile);
