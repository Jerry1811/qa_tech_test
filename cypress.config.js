const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        viewportWidth: 1920,
        viewportHeight: 1080,
        browser: 'chrome',
        pageLoadTimeout: 100000,
        defaultCommandTimeout: 10000,
        video: false,
        retries: 0,
        scrollBehavior: 'center',
        chromeWebSecurity: false,
        watchForFileChanges: false,
        reporter: 'cypress-multi-reporters',
        reporterOptions: {
            reporterEnabled: 'mochawesome',
            mochawesomeReporterOptions: {
                reportDir: 'cypress/results/json',
                reportFilename: '[status]_[datetime]-[name]-report',
                overwrite: false,
                html: false,
                json: true,
            },
        },
    },
});
