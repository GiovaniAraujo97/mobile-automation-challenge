const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const platform = (process.env.PLATFORM || 'android').toLowerCase();
const isIOS = platform === 'ios';
const appPath = path.resolve(
    process.env[isIOS ? 'IOS_APP' : 'ANDROID_APP'] ||
        (isIOS
            ? 'apps/ios.simulator.wdio.native.app.v2.2.0.zip'
            : 'apps/android.wdio.native.app.v2.2.0.apk'),
);
const appiumServer = new URL(process.env.APPIUM_SERVER_URL || 'http://127.0.0.1:4723');
const platformVersion = process.env[isIOS ? 'IOS_PLATFORM_VERSION' : 'ANDROID_PLATFORM_VERSION'];

if (!['android', 'ios'].includes(platform)) {
    throw new Error(`PLATFORM deve ser android ou ios; recebido: ${platform}`);
}

const platformCapabilities = isIOS
    ? {
          platformName: 'iOS',
          'appium:automationName': 'XCUITest',
          'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 16',
          'appium:bundleId': 'org.wdiodemoapp',
          'appium:app': appPath,
          'appium:noReset': false,
          'appium:newCommandTimeout': 180,
      }
    : {
          platformName: 'Android',
          'appium:automationName': 'UiAutomator2',
          'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
          'appium:appPackage': 'com.wdiodemoapp',
          'appium:app': appPath,
          'appium:autoGrantPermissions': true,
          'appium:noReset': false,
          'appium:adbExecTimeout': 120000,
          'appium:uiautomator2ServerInstallTimeout': 120000,
          'appium:uiautomator2ServerLaunchTimeout': 120000,
          'appium:newCommandTimeout': 180,
      };

if (platformVersion) {
    platformCapabilities['appium:platformVersion'] = platformVersion;
}

exports.config = {
    runner: 'local',
    specs: ['./test/specs/**/*.spec.js'],
    maxInstances: 1,
    hostname: appiumServer.hostname,
    port: Number(appiumServer.port || (isIOS ? 4723 : 4723)),
    path: appiumServer.pathname || '/',
    logLevel: 'warn',
    framework: 'mocha',
    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: './allure-results',
                disableWebdriverScreenshotsReporting: false,
                reportedEnvironmentVars: {
                    Platform: platform,
                    Device: isIOS
                        ? process.env.IOS_DEVICE_NAME || 'iPhone 16 Simulator'
                        : process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
                    App: 'WebdriverIO Native Demo App 2.2.0',
                    AppiumServer: appiumServer.origin,
                },
            },
        ],
    ],
    capabilities: [platformCapabilities],
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
    },
    waitforTimeout: 10000,
    connectionRetryTimeout: 300000,
    connectionRetryCount: 2,
    onPrepare() {
        if (!fs.existsSync(appPath)) {
            throw new Error(`Aplicativo nao encontrado: ${appPath}. Rode npm run apps:download.`);
        }
        fs.mkdirSync(path.resolve('artifacts/screenshots'), {recursive: true});
        fs.mkdirSync(path.resolve('allure-results'), {recursive: true});
    },
    async afterTest(test, _context, result) {
        if (result.passed || !browser.sessionId) {
            return;
        }

        const allureReporter = require('@wdio/allure-reporter').default;
        const safeTitle = test.title.replace(/[^a-zA-Z0-9_-]+/g, '-');
        const screenshotPath = path.resolve(
            'artifacts/screenshots',
            `${Date.now()}-${safeTitle}.png`,
        );
        const screenshotBase64 = await browser.takeScreenshot();
        fs.writeFileSync(screenshotPath, Buffer.from(screenshotBase64, 'base64'));
        allureReporter.addAttachment(
            `Screenshot: ${test.title}`,
            Buffer.from(screenshotBase64, 'base64'),
            'image/png',
        );
    },
};
