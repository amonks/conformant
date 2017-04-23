const generateDocs = require('generate-docs').default

generateDocs({
  paths: [
    'src/index.js',
    'src/commands.js',
    'src/check.js',
    'src/conform.js',
    'src/instrument.js',
    'src/specs.js'
  ],
  output: 'README.md'
})

