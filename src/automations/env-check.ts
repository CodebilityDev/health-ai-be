import { readFileSync, writeFileSync } from "fs";

import { join } from "path";

// read .env file, keep all lines as it is, with only the values being obfuscated
const envFile = readFileSync(join(__dirname, "..", "..", ".env"));

// if env file is not found, throw an error
if (!envFile) {
  throw new Error("No env file found");
}

// check if .env.sample doesnt exist, create one
let envSampleFile;
try {
  envSampleFile = readFileSync(join(__dirname, "..", "..", ".env.sample"));
} catch (e) {
  console.warn("No env.sample file found, creating one");
  // copy .env to .env.sample
  writeFileSync(join(__dirname, "..", "..", ".env.sample"), envFile);
  envSampleFile = envFile;
}

// get the key value pairs from the .env and .env.sample files, compare on what keys is missing from .env.sample
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
  .map((line) => {
    if (line.startsWith("#")) {
      return line;
    }
    const [key, value] = line.split("=");
    // if VALUE exists in actual # VALUE, use that, else use the value from the .env file
    let [, recommendedValue] = value.split("#");
    // strip whitespace from VALUE
    recommendedValue = (recommendedValue ?? "").trim();
    return key;
  });

const envSampleVars = envSampleFile
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
  .map((line) => {
    if (line.startsWith("#")) {
      return line;
    }
    const [key, value] = line.split("=");
    // if VALUE exists in actual # VALUE, use that, else use the value from the .env file
    let [, recommendedValue] = value.split("#");
    // strip whitespace from VALUE
    recommendedValue = (recommendedValue ?? "").trim();
    return key;
  });

const missingKeysOnEnvSample = envVars.filter(
  (key) => !envSampleVars.includes(key),
);

if (missingKeysOnEnvSample.length > 0) {
  throw new Error(
    "Missing keys on .env.sample. Please manually add the new variables in .env.sample [" +
      missingKeysOnEnvSample.join(", ") +
      "]",
  );
}
