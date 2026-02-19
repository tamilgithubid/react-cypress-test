import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // URL where your Vite dev server runs
    baseUrl: 'http://localhost:5173',

    // Where your test files live
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx}',

    // Support file (custom commands, global setup)
    supportFile: 'cypress/support/e2e.js',

    // Viewport size for tests
    viewportWidth: 1280,
    viewportHeight: 720,

    // How long to wait for elements (ms)
    defaultCommandTimeout: 6000,

    // Save screenshots + videos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,

    // Memory optimization — free DOM snapshots after each test
    numTestsKeptInMemory: 0,

    // How Cypress starts Vite before running tests
    setupNodeEvents(on, config) {
      // Reduce video memory usage by lowering compression quality
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Log video path for debugging
          console.log('Video saved:', results.video);
        }
      });
      return config;
    },
  },
});
