import { test, expect } from '@playwright/test';
import { ExampleStore, baseUrl } from './example-store-locators';

test.describe('Наличие страниц магазина', () => {

    test.use({
        viewport: {
            height: 1280,
            width: 1024
        }
    });

    test.beforeEach(async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoMainPage();
    });

    test('Страница "главная" имеет корректный title и расположены по корректным URL', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await expect(page).toHaveTitle('Welcome — Example store');
        await expect(page).toHaveURL(baseUrl);
    });

    test('Страница "Каталог" имеет корректный title и расположены по корректным URL', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.catalogNavLink.click();
        await expect(page).toHaveTitle('Catalog — Example store');
        await expect(page).toHaveURL(`${baseUrl}/catalog`);
    });

    test('Страница "Доставка" имеет корректный title и расположены по корректным URL', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.deliveryNavLink.click();
        await expect(page).toHaveTitle('Delivery — Example store');
        await expect(page).toHaveURL(`${baseUrl}/delivery`);
    });

    test('Страница "Контакты" имеет корректный title и расположены по корректным URL', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.contactsNavLink.click();
        await expect(page).toHaveTitle('Contacts — Example store');
        await expect(page).toHaveURL(`${baseUrl}/contacts`);
    });

    test('Страница "Корзина" имеет корректный title и расположены по корректным URL', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.cartNavLink.click();
        await expect(page).toHaveTitle('Shopping cart — Example store');
        await expect(page).toHaveURL(`${baseUrl}/cart`);
    });

    test('название магазина в шапке должно быть ссылкой на главную страницу', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCatalogPage();
        await exampleStore.pageLogo.click();
        await expect(page).toHaveTitle('Welcome — Example store');
        await expect(page).toHaveURL(`${baseUrl}/`);
    });

    test('Скриншотный тест страницы "Главная" на десктоп разрешении', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        expect(await page.screenshot()).toMatchSnapshot({
            name: 'main-page-desc.png',
            maxDiffPixels: 10,
            threshold: 0.3,
        });
    })

    test('Скриншотный тест страницы "Каталог" на десктоп разрешении', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCatalogPage();
        expect(await page.screenshot()).toMatchSnapshot({
            name: 'catalog-page-desc.png',
            maxDiffPixels: 10,
            threshold: 0.3,
        });
    })

    // test('', async({page}) => {

    // });
});


test.describe('Адаптивность верстки', () => {

    test.use({
        viewport: {
            height: 900,
            width: 575
        }
    });


    test.beforeEach(async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoMainPage();
    });

    test('на ширине экрана меньше 576px навигационное меню скрыто за кнопкой "гамбургер"', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await expect(exampleStore.navLinksContainer).not.toBeVisible();
        await expect(exampleStore.gamburgerBtn).toBeVisible();
        await exampleStore.gamburgerBtn.click();
        await expect(exampleStore.navLinksContainer).toBeVisible();
    });

    test('при выборе элемента из меню "гамбургера", меню должно закрываться', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gamburgerBtn.click();
        await exampleStore.catalogNavLink.click();
        await expect(exampleStore.navLinksContainer).not.toBeVisible();
    });

    test('Скриншотный тест страницы "Главная" на мобильном разрешении', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        expect(await page.screenshot()).toMatchSnapshot({
            name: 'main-page-mobile.png',
            maxDiffPixels: 10,
            threshold: 0.3,
        });
    })

    test('Скриншотный тест страницы "Каталог" на мобильном разрешении', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCatalogPage();
        expect(await page.screenshot()).toMatchSnapshot({
            name: 'catalog-page-mobile.png',
            maxDiffPixels: 10,
            threshold: 0.3,
        });
    })
});


test.describe('Отображение информации о товарах в каталоге и на странице Details', () => {

    test('в каталоге должны отображаться товары, список которых приходит с сервера', async ({ page }) => {
        await page.route('http://localhost:3000/hw/store/api/products', async (route) => {
            const json = [{
                        id: 0,
                        name: 'test axios1',
                        price: 123,

                    }, {
                        id: 1,
                        name: '2test axios1',
                        price: 223,

                    }, {
                        id: 3,
                        name: '3test axios1',
                        price: 323,
                    },
                    ]
            await route.fulfill({ json });
        });

        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCatalogPage();
        await page.pause();
        const count = await exampleStore.itemCards.count();

        await page.pause();
        expect(count).toBe(3);
    });

    test('для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCatalogPage();
        const count = await exampleStore.itemCards.count();
        for (let i = 0; i < count; ++i) {
            await exampleStore.checkCatalogItemPropeties(i);
        }
    });

    test('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка * * "добавить в корзину', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoItemDetailsPage();
        await exampleStore.checkDetailPageContent();
    });

    // test('', async({page}) => {

    // });

})


test.describe('Проверки с добавлением товара в корзину', () => {

    test.beforeEach(async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.addItemToCart(0);
    });

    test.afterEach(async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCartPage();
        await exampleStore.resetCartBtn.click();
    });

    test('если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCatalogPage();
        await expect(exampleStore.itemInCartInfoPlate).toBeVisible();
        await exampleStore.gotoItemDetailsPage();
        await expect(exampleStore.itemInCartInfoPlate).toBeVisible();
    });

    test('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.addItemToCart(0);
        await exampleStore.gotoCartPage();
        await expect(exampleStore.itemQuantityInCart).toContainText('2');
    });

    test('содержимое корзины должно сохраняться между перезагрузками страницы', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCartPage();
        await page.reload();
        await expect(exampleStore.itemQuantityInCart).toContainText('1');
    });

    // test('', async({page}) => {

    // });

});


test.describe('Проверки с добавлением нескольких товаров в корзину', () => {

    test.beforeEach(async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.addItemToCart(0);
        await exampleStore.addItemToCart(1);
        await exampleStore.addItemToCart(1);
        await exampleStore.addItemToCart(1);
        await exampleStore.addItemToCart(2);
        await exampleStore.addItemToCart(2);
    });

    test.afterEach(async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCartPage();
        await exampleStore.resetCartBtn.click();
    });

    test('в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await expect(exampleStore.cartNavLink).toContainText('(3)');
    });

    test('в корзине должна отображаться таблица с добавленными в нее товарами', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCartPage();
        await expect(exampleStore.rowsInCartTable).toHaveCount(5);
    });

    test('для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCartPage();
        const count = await exampleStore.rowsInCartTable.count();
        for (let i = 1; i < count - 1; ++i) {
            await exampleStore.checkCartTableProperties(i);
        }
        await expect(exampleStore.cartOrderPrice).not.toBeEmpty();
    });

    test('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCartPage();
        await exampleStore.resetCartBtn.click();
        await expect(exampleStore.cartTable).toHaveCount(0);
        await exampleStore.addItemToCart(0);
    });

    test('если корзина пустая, должна отображаться ссылка на каталог товаров', async ({ page }) => {
        const exampleStore = new ExampleStore(page);
        await exampleStore.gotoCartPage();
        await exampleStore.resetCartBtn.click();
        await expect(exampleStore.catalogLinkInEmptyCart).toHaveCount(1);
        await exampleStore.addItemToCart(0);
    });
});