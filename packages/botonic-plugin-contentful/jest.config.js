module.exports = {
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(ts|tsx)$",
  testPathIgnorePatterns: ['lib'],
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  snapshotSerializers: [],
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/tests/__mocks__/fileMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  }
};
