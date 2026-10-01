const BasePage = require('./BasePage');

class HomePage extends BasePage {
    get screen() {
        return this.elementByAccessibilityId('Home-screen');
    }

    async waitUntilLoaded() {
        await this.screen.waitForDisplayed();
    }

    async openLogin() {
        await this.openTab('Login');
        await this.waitForAccessibilityId('Login-screen');
    }

    async openForms() {
        await this.openTab('Forms');
        await this.waitForAccessibilityId('Forms-screen');
    }

    async openHome() {
        await this.openTab('Home');
        await this.waitForAccessibilityId('Home-screen');
    }
}

module.exports = HomePage;
