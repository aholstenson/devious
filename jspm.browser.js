SystemJS.config({
  baseURL: "/src",
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*",
    "devious/": "js/"
  }
});
