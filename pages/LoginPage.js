const BasePage = require('./BasePage');

class LoginPage extends BasePage {
    get emailInput() {
        return this.elementByAccessibilityId('input-email');
    }

    get passwordInput() {
        return this.elementByAccessibilityId('input-password');
    }

    get confirmationInput() {
        return this.elementByAccessibilityId('input-repeat-password');
    }

    async waitUntilLoaded() {
        await this.waitForAccessibilityId('Login-screen');
        await this.emailInput.waitForDisplayed();
    }

    async chooseSignUp() {
        await this.elementByAccessibilityId('button-sign-up-container').click();
        await this.confirmationInput.waitForDisplayed();
    }

    async enterCredentials(email, password) {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
    }

    async submitLogin() {
        await this.elementByAccessibilityId('button-LOGIN').click();
    }

    async submitSignUp() {
        const submitButton = await this.scrollToAccessibilityId('Login-screen', 'button-SIGN UP');
        await submitButton.click();
    }

    async dismissAlert() {
        await this.elementByText('OK').click();
    }
}

module.exports = LoginPage;
