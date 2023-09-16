import { test, expect, type Page, type Locator } from '@playwright/test';

import { mockedProducts } from '../mockedProducts';

export const baseUrl = 'http://localhost:3000/hw/store';

export class ExampleStore {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }



    get pageLogo() {
        return this.page.locator('.Application-Brand');
    }

    //Nav Links in Header

    get navLinksContainer() {
        return this.page.locator('.Application-Menu');
    }

    get gamburgerBtn() {
        return this.page.getByRole('button', { name: 'Toggle navigation' });
    }

    get cartNavLink() {
        return this.page.getByRole('link').filter({ hasText: 'Cart' });
    }

    get contactsNavLink() {
        return this.page.getByRole('link').filter({ hasText: 'Contacts' });
    }

    get deliveryNavLink() {
        return this.page.getByRole('link').filter({ hasText: 'Delivery' });
    }

    get catalogNavLink() {
        return this.page.getByRole('link').filter({ hasText: 'Catalog' });
    }

    //Catalog items: cards and it's details

    get itemCards() {
        return this.page.locator('.ProductItem')
    }

    get cardNames() {
        return this.page.locator('.ProductItem-Name');
    }

    get cardPrices() {
        return this.page.locator('.ProductItem-Price');
    }

    get cardLinks() {
        return this.page.locator('.ProductItem-DetailsLink');
    }

    //Item details page:

    get addToCartBtn() {
        return this.page.getByRole('button', { name: 'Add to Cart' });
    }

    get itemInCartInfoPlate() {
        return this.page.getByText('Item in cart');
    }



    //Cart items

    get resetCartBtn() {
        return this.page.getByRole('button', { name: 'Clear shopping cart' });
    }

    get cartTable() {
        return this.page.locator('.Cart-Table');
    }

    get rowsInCartTable() {
        return this.page.getByRole('row');
    }

    get cartOrderPrice() {
        return this.page.locator('.Cart-OrderPrice');
    }

    get itemQuantityInCart() {
        return this.page.locator('.Cart-Count');
    }

    get catalogLinkInEmptyCart() {
        return this.page.getByRole('link', { name: 'catalog', exact: true });
    }



    async gotoMainPage() {
        await this.page.goto(baseUrl);
    }

    async gotoCatalogPage() {
        //mocked Data for Catalog Page
        await this.page.route(`${baseUrl}/api/products`, async (route) => {
            const json = mockedProducts;
            await route.fulfill({ json });
        });
        await this.page.goto(`${baseUrl}/catalog`);
    }

    async gotoItemDetailsPage() {
        await this.page.goto(`${baseUrl}/catalog/0`);
    }

    async gotoCartPage() {
        await this.page.goto(`${baseUrl}/cart`);
    }

    async checkCatalogItemPropeties(index: number) {
        await expect(this.cardNames.nth(index)).not.toBeEmpty();
        await expect(this.cardPrices.nth(index)).not.toBeEmpty();
        await expect(this.cardLinks.nth(index)).not.toBeEmpty();
    }

    async checkDetailPageContent() {
        await expect(this.page.locator('.ProductDetails-Name')).not.toBeEmpty();
        await expect(this.page.locator('.ProductDetails-Description')).not.toBeEmpty();
        await expect(this.page.locator('.ProductDetails-Price')).not.toBeEmpty();
        await expect(this.page.locator('.ProductDetails-Color')).not.toBeEmpty();
        await expect(this.page.locator('.ProductDetails-Material')).not.toBeEmpty();
        await expect(this.page.locator('.ProductDetails-AddToCart')).toHaveCount(1);
    }

    async checkCartTableProperties(index: number) {
        await expect(this.rowsInCartTable.nth(index).filter({ has: this.page.locator('.Cart-Index') })).not.toBeEmpty();
        await expect(this.rowsInCartTable.nth(index).filter({ has: this.page.locator('.Cart-Name') })).not.toBeEmpty();
        await expect(this.rowsInCartTable.nth(index).filter({ has: this.page.locator('.Cart-Price') })).not.toBeEmpty();
        await expect(this.rowsInCartTable.nth(index).filter({ has: this.page.locator('.Cart-Count') })).not.toBeEmpty();
        await expect(this.rowsInCartTable.nth(index).filter({ has: this.page.locator('.Cart-Total') })).not.toBeEmpty();
    }

    async addItemToCart(index: number) {
        await this.gotoCatalogPage();
        await this.cardLinks.nth(index).click();
        await this.addToCartBtn.click();
    }
}