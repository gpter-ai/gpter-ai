const esModules = ['d3-.*', 'internmap'].join('|');

module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  coveragePathIgnorePatterns: [],
  // setupFilesAfterEnv: ["./config/jest/setupTests.js"],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|js|tsx|jsx)$': '@swc/jest',
    // "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    // "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)"
    // "<rootDir>/config/jest/fileTransform.js"
  },
  preset: '@cloudscape-design/jest-preset',
  // this transform ignore config is necessary to be able to test cloudscape components
  // Check troubleshooting here https://github.com/cloudscape-design/jest-preset
  transformIgnorePatterns: [
    `/node_modules/(?!(${esModules}|@cloudscape-design/)).+\\.(js|jsx|mjs|cjs|ts|tsx)$`,
    `'^.+\\.module\\.(css|sass|scss)$'`,
  ],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: [
    'tsx',
    'ts',
    'web.js',
    'js',
    'web.ts',
    'web.tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  // watchPlugins: [
  //   "jest-watch-typeahead/filename",
  //   "jest-watch-typeahead/testname"
  // ],
  resetMocks: true,
};
