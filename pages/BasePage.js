class BasePage {
    elementByAccessibilityId(id) {
        return $(`~${id}`);
    }

    elementByText(text) {
        const escapedText = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        return $(`//*[contains(@text,"${escapedText}") or contains(@label,"${escapedText}") or contains(@name,"${escapedText}")]`);
    }

    async waitForAccessibilityId(id) {
        const element = this.elementByAccessibilityId(id);
        await element.waitForDisplayed();
        return element;
    }

    async waitForText(text) {
        const element = this.elementByText(text);
        await element.waitForDisplayed();
        return element;
    }

    async openTab(name) {
        await this.elementByAccessibilityId(name).click();
    }

    async scrollToAccessibilityId(containerId, targetId) {
        const container = await this.waitForAccessibilityId(containerId);
        await browser.execute('mobile: scrollGesture', {
            elementId: container.elementId,
            direction: 'down',
            percent: 0.75,
        });
        return this.waitForAccessibilityId(targetId);
    }
}

module.exports = BasePage;
