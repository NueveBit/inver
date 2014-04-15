exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        'e2e/*.js'
    ],
    capabilities: {
        'browserName': 'firefox'
    },
    chromeOnly: false,
    //seleniumAddress: 'http://0.0.0.0:4444/wd/hub',
    baseUrl: 'http://localhost:8000/',
    framework: 'jasmine',
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
