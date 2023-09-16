import React from 'react';

import { it, expect } from '@jest/globals';

import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Application } from '../../src/client/Application'

import { ProductDetails } from '../../src/client/components/ProductDetails';
import { Form } from '../../src/client/components/Form';

import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';


import { render, cleanup, screen, fireEvent, waitFor, within, findByTestId } from '@testing-library/react';
// import userEvent from '@testing-library/user-event'

import axiosMock from './__mocks__/axios'
import { mockedProducts, mockedProductDetails } from '../mockedProducts';

// полезные материалы:
// тестирование адаптивности: https://www.js-howto.com/test-responsive-design-using-jest-and-react-testing-library/
// тестрование роутера: https://testing-library.com/docs/example-react-router/
// посмотреть разметку в песочнице screen.logTestingPlaygroundURL();


//создание стора для тестирования компонентов с redux
const api = new ExampleApi('/hw/store');
const cart = new CartApi();
const store = initStore(api, cart);

//функция, которая возвращает приложение целиком, вкл. стор и роутер.
//MemoryRouter предназанчен специально для тестирования, в отличие от BrowserRouter не использует внешние зависимости. 
function app(initialEntry: string = '/hw/store') {
    const basename = initialEntry;
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);

    const application = (
        <MemoryRouter initialEntries={[initialEntry]}>
            <Provider store={store}>
                <Application />
            </Provider>
        </MemoryRouter >
    );

    return application;
}

describe('Тестирование навигации по страницам и их содержимого', () => {

    it('путь /contacts ведет на страницу "контакты", которая имеет статическое содержимое', () => {
        const { container } = render(app('/contacts'));
        expect(container).toMatchSnapshot();
    });


    it('на главной странице есть ссылка Delivery, клик по которой переводит на страницу "доставка", которая имеет статическое содержимое', async () => {
        const { getByText, findByTestId } = render(app());
        const deliveryLink = getByText('Delivery');
        fireEvent.click(deliveryLink);
        const deliveryPage = await findByTestId('deliveryPageContainer');
        expect(deliveryPage).toMatchSnapshot();
    });

});


describe('Тестирование страницы "Каталога" с использованием заглушки на axios', () => {

    it('в каталоге должны отображаться товары, список которых приходит с сервера', async () => {
        axiosMock.get.mockResolvedValueOnce({ data: mockedProducts })
        const { getAllByTestId } = render(app('/catalog'));
        const cards = await waitFor(() => getAllByTestId(/^\d+$/));
        expect(cards.length).toBe(17);
    });


    it('для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async () => {
        axiosMock.get.mockResolvedValueOnce({ data: mockedProducts })
        const { getByText, getAllByTestId } = render(app());
        fireEvent.click(getByText('Catalog'));
        const cards = await waitFor(() => getAllByTestId(/^\d+$/));

        cards.forEach((card, index) => {
            const heading = within(card).getByTestId(/^\d+_productName$/);
            const price = within(card).getByTestId(/^\d+_productPrice$/);
            const detailsBtn = within(card).getByTestId(/^\d+_productDetailsBtn$/);

            expect(heading.textContent).toContain(mockedProducts[index].name);
            expect(price.textContent).toContain(String(mockedProducts[index].price));
            expect(detailsBtn.getAttribute("href")).toBe(`/catalog/${mockedProducts[index].id}`)
        })
    });
});


describe('Тестирование отдельных компонентов', () => {

    it('Компонент ProductDetails отображает: название товара, его описание, цена, цвет, материал и кнопку "добавить в корзину"', async () => {

        const { container, getByTestId } = render(
            <Provider store={store}>
                <ProductDetails product={mockedProductDetails} />
            </Provider>
        );

        const heading = getByTestId(/^\d+_productName$/);
        const price = getByTestId(/^\d+_productPrice$/);
        const description = getByTestId(/^\d+_productDescription$/);
        const color = getByTestId(/^\d+_productColor$/);
        const material = getByTestId(/^\d+_productMaterial$/);
        const addToCartBtn = getByTestId(/^\d+_addToCartBtn$/);

        expect(heading.textContent).toContain(mockedProductDetails.name);
        expect(price.textContent).toContain(String(mockedProductDetails.price));
        expect(description.textContent).toContain(mockedProductDetails.description);
        expect(color.textContent).toContain(mockedProductDetails.color);
        expect(material.textContent).toContain(mockedProductDetails.material);
        expect(addToCartBtn.tagName).toBe('BUTTON');
    });


    it('при сабмите Form с некорректным номером телефона, на соотв. input добавляется CSS класс "is-invalid"', async () => {
        const { getByTestId } = render(<Form onSubmit={() => { }} />);

        const userNameInput = getByTestId('userNameInput');
        const userPhoneInput = getByTestId('userPhoneInput');
        const userAddressInput = getByTestId('userAddressInput');
        const submitBtn = getByTestId('submitBtn');

        fireEvent.change(userNameInput, { target: { value: 'Dmitry' } })
        fireEvent.change(userPhoneInput, { target: { value: '123' } })
        fireEvent.change(userAddressInput, { target: { value: 'Moscow, Komsomolskaya str. 12-2-123' } })
        fireEvent.click(submitBtn)
        expect(userPhoneInput.classList).toContain('is-invalid')
    });
})






