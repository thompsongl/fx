function runAllTests() {
  const appContext = require.context('..', true, /\.spec\.tsx?$/);
  appContext.keys().forEach(appContext);
}

runAllTests();
