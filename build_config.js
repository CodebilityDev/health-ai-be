const resolveTsAliases = require("esbuild-ts-paths");

exports.getEsbuildConfig = (cwd) => {
  return {
    entryPoints: ["./src/keystone.ts"],
    absWorkingDir: cwd,
    bundle: true,
    sourcemap: true,
    // TODO: this cannot be changed for now, circular dependency with getSystemPaths, getEsbuildConfig
    outfile: "keystone.ts",
    format: "cjs",
    platform: "node",
    plugins: [
      resolveTsAliases(),
      {
        name: "external-node_modules",
        setup(build) {
          build.onResolve(
            {
              // this regex is intended to be the opposite of /^\.\.?(?:\/|$)/
              // so it matches anything that isn't a relative import
              // so this means that we're only going to bundle relative imports
              // we can't use a negative lookahead/lookbehind because this regex is executed
              // by Go's regex package which doesn't support them
              // this regex could have less duplication with nested groups but this is probably easier to read
              filter: /(?:^[^.])|(?:^\.[^/.])|(?:^\.\.[^/])/,
            },
            (args) => {
              return {
                external: true,
                path: args.path,
              };
            }
          );
        },
      },
    ],
  };
};
