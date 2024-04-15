// read env file
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { format } from "prettier";

async function main() {
  let envFile;
  try {
    envFile = readFileSync(join(__dirname, "..", "..", ".env"));
  } catch (e) {
    console.warn("No env file found, creating one");
    // copy .env.sample to .env
    const envSample = readFileSync(join(__dirname, "..", "..", ".env.sample"));
    writeFileSync(join(__dirname, "..", "..", ".env"), envSample);
    envFile = envSample;
  }

  // if env file is not found, throw an error
  if (!envFile) {
    throw new Error("No env file found");
  }

  // parse the env file
  const env = envFile.toString().split("\n");

  // filter out comments and empty lines
  const envVars = env.filter((line) => line && !line.startsWith("#"));
  const envObject: Record<string, string> = {};
  envVars.forEach((line) => {
    const [key, value] = line.split("=");
    // remove \r from value
    envObject[key] = value.replace("\r", "");
    // get VALUE from "normal # VALUE"
    let [, recommendedValue] = value.split("#");
    // strip whitespace from VALUE
    recommendedValue = (recommendedValue ?? "").trim();
    envObject[key] = recommendedValue;
  });

  // Logger.log(envObject);

  // generate code to create an exported object with the env variables, either they return the value or return a blank string
  const code = `import * as dotenv from 'dotenv';
dotenv.config();\n
export const CONFIG = {
  ${Object.keys(envObject)
    .map((key) => `${key}: process.env.${key} || '${envObject[key]}'`)
    .join(",\n")}
};\n`;

  // format the code with prettier
  const formattedCode = await format(code, {
    parser: "typescript",
    singleQuote: true,
    trailingComma: "all",
  });

  // write the code to the file
  writeFileSync(join(__dirname, "..", "config", "env.ts"), formattedCode);
}

main();
