const {expect} = require('chai');
const loginInvalidCases = require('../../data/login-invalid-cases.json');
const FormsPage = require('../../pages/FormsPage');
const HomePage = require('../../pages/HomePage');
const LoginPage = require('../../pages/LoginPage');

const homePage = new HomePage();
const loginPage = new LoginPage();
const formsPage = new FormsPage();

describe('WebdriverIO Native Demo App', () => {
    it('01 - exibe a tela inicial e a marca do app', async () => {
        await homePage.waitUntilLoaded();
        await homePage.waitForText('Demo app for the appium-boilerplate');
        await homePage.elementByAccessibilityId('Login').waitForDisplayed();
    });

    it('02 - navega entre Home, Login e Forms', async () => {
        await homePage.openLogin();
        await loginPage.waitUntilLoaded();
        await homePage.openForms();
        await formsPage.waitUntilLoaded();
        await homePage.openHome();
    });

    it('03 - valida email e senha no login com dados parametrizados', async () => {
        await homePage.openLogin();
        await loginPage.waitUntilLoaded();

        for (const testData of loginInvalidCases) {
            await loginPage.emailInput.clearValue();
            await loginPage.passwordInput.clearValue();
            await loginPage.enterCredentials(testData.email, testData.password);
            await browser.hideKeyboard().catch(() => undefined);
            await loginPage.submitLogin();
            await loginPage.waitForText(testData.expectedMessage);
        }
    });

    it('04 - realiza login com credenciais em formato válido', async () => {
        await homePage.openLogin();
        await loginPage.waitUntilLoaded();
        await loginPage.enterCredentials('demo@example.com', 'DemoPass123');
        await browser.hideKeyboard().catch(() => undefined);
        await loginPage.submitLogin();
        await loginPage.waitForText('You are logged in!');
        await loginPage.dismissAlert();
    });

    it('05 - alterna para cadastro e exibe confirmação de senha', async () => {
        await homePage.openLogin();
        await loginPage.waitUntilLoaded();
        await loginPage.chooseSignUp();
        await expect(await loginPage.confirmationInput.isDisplayed()).to.equal(true);
    });

    it('06 - rejeita cadastro com senhas diferentes', async () => {
        await homePage.openLogin();
        await loginPage.waitUntilLoaded();
        await loginPage.chooseSignUp();
        await loginPage.enterCredentials('new-user@example.com', 'ValidPass123');
        await loginPage.confirmationInput.setValue('DifferentPass123');
        await browser.hideKeyboard().catch(() => undefined);
        await loginPage.submitSignUp();
        await loginPage.waitForText('Please enter the same password');
    });

    it('07 - cadastra usuário com dados válidos', async () => {
        await homePage.openLogin();
        await loginPage.waitUntilLoaded();
        await loginPage.chooseSignUp();
        await loginPage.enterCredentials('new-user@example.com', 'ValidPass123');
        await loginPage.confirmationInput.setValue('ValidPass123');
        await browser.hideKeyboard().catch(() => undefined);
        await loginPage.submitSignUp();
        await loginPage.waitForText('You successfully signed up!');
        await loginPage.dismissAlert();
    });

    it('08 - preenche o formulário e atualiza o texto de resultado', async () => {
        await homePage.openForms();
        await formsPage.waitUntilLoaded();
        await formsPage.enterText('Teste mobile');
        await expect(await formsPage.textResult.getText()).to.equal('Teste mobile');
    });

    it('09 - alterna o switch e valida o estado exibido', async () => {
        await homePage.openForms();
        await formsPage.waitUntilLoaded();
        await formsPage.waitForText('Click to turn the switch ON');
        await formsPage.toggleSwitch();
        await formsPage.waitForText('Click to turn the switch OFF');
    });

    it('10 - abre e fecha o alerta do botao ativo', async () => {
        await homePage.openForms();
        await formsPage.waitUntilLoaded();
        await formsPage.showActiveButtonAlert();
        await formsPage.waitForText('This button is active');
        await formsPage.elementByText('OK').click();
    });
});
