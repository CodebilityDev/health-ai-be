const esbuild = require("esbuild");
const { getEsbuildConfig } = require("./build_config.js");

const cwd = process.cwd();

const settings = getEsbuildConfig(cwd);

async function build() {
  await esbuild.build(settings);
  console.log("✨ Build complete");
}

build();
