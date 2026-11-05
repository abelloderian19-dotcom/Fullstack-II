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
    },
    browsers: ["jsdom"],
    reporters: ["progress"],
  });
};
