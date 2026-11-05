module.exports = (config) => {
  config.set({
    frameworks: ["jasmine"],
    files: ["src/**/*.spec.js"],
    preprocessors: {
      "src/**/*.spec.js": ["esbuild"],
    },
    esbuild: {
      target: "es2020",
      jsx: "automatic",
    },
    browsers: ["jsdom"],
    reporters: ["progress"],
  });
};
