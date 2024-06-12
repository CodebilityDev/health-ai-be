const esbuild = require("esbuild");
const { getEsbuildConfig } = require("./build_config.js");

async function watch() {
  let ctx = await esbuild.context(getEsbuildConfig(process.cwd()));
  await ctx.watch();
  console.log("✨ ESBuilder Watcher Started...");
}
watch();
