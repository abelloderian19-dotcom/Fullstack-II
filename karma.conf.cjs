const fs = require("node:fs");
const path = require("node:path");

const jsxTestResolver = {
  name: "karma-jsx-test-resolver",
  setup(build) {
    build.onResolve({ filter: /\.test\.js$/ }, ({ path: importPath, resolveDir }) => {
      const jsxPath = path.resolve(
        resolveDir,
        importPath.replace(/\.test\.js$/, ".test.jsx"),
      );
      return fs.existsSync(jsxPath) ? { path: jsxPath } : undefined;
    });
  },
};

module.exports = (config) => {
  config.set({
    frameworks: ["jasmine"],
    files: ["src/components/test/**/*.test.jsx"],
    preprocessors: {
      "src/components/test/**/*.test.jsx": ["esbuild"],
    },
    esbuild: {
      target: "es2020",
      jsx: "automatic",
      plugins: [jsxTestResolver],
    },
    browsers: ["jsdom"],
    reporters: ["progress"],
  });
};
