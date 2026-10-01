const BasePage = require('./BasePage');

class FormsPage extends BasePage {
    get textInput() {
        return this.elementByAccessibilityId('text-input');
    }

    get textResult() {
        return this.elementByAccessibilityId('input-text-result');
    }

    get toggle() {
        return this.elementByAccessibilityId('switch');
    }

    async waitUntilLoaded() {
        await this.waitForAccessibilityId('Forms-screen');
        await this.textInput.waitForDisplayed();
    }

    async enterText(value) {
        await this.textInput.setValue(value);
    }

    async toggleSwitch() {
        await this.toggle.click();
    }

    async showActiveButtonAlert() {
        const activeButton = await this.scrollToAccessibilityId('Forms-screen', 'button-Active');
        await activeButton.click();
    }
}

module.exports = FormsPage;
