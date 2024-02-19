const package = require("./package");

//输出源
const output = {
  library: "BlueDepute",
  libraryTarget: "umd",
  libraryExport: "default",
};

const name = `blue-depute`;

const currentYear = +new Date().getFullYear();

module.exports = {
  library: {
    name,
    github: `https://github.com/azhanging/${name}`,
    date: `2016-${currentYear}`,
    version: package.version,
    author: package.author,
  },
  webpackConfig: {
    dev: {
      output,
    },
    prod: {
      output,
    },
  },
};
