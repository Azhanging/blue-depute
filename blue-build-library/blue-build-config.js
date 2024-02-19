const library = {
  version: ``,
  author: ``
};

//输出源
const output = {
  library: "",
  libraryTarget: 'umd',
  libraryExport: 'default'
};

module.exports = {
  library: {
    name: '',
    github: `https://github.com/azhanging/`,
    date: `2016-2020`,
    version: library.version,
    author: library.author
  },
  webpackConfig: {
    dev: {
      output
    },
    prod: {
      output
    }
  }
};