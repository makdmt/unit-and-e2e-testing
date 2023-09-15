import React from 'react';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Application } from '../../src/client/Application'

import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';

// import { application } from '../../src/client/index'


import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axiosMock from './__mocks__/axios'

import { mockedProducts } from '../mockedProducts';


axiosMock.get.mockResolvedValueOnce({ data: mockedProducts})

// jest.mock('axios');

function app () {
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);

    const application = (
        <BrowserRouter basename='/hw/store/'>
            <Provider store={store}>
                <Application />
            </Provider>
        </BrowserRouter>
    );

    return application;
}



describe('Simple Test Case', () => {

    it('Should return 4', async () => {

        // const basename = '/hw/store';
        // const api = new ExampleApi(basename);
        // const cart = new CartApi();
        // const store = initStore(api, cart);

        // const application = (
        //     <BrowserRouter basename='/hw/store/'>
        //         <Provider store={store}>
        //             <Application />
        //         </Provider>
        //     </BrowserRouter>
        // );



        const { container, getByText } = render(app());

        // await events.click(getByText("Catalog"));

        // const catalog_heading = await screen.findByTestId('CatHead')


        // const card = await screen.findByText('test axios1')


        // expect(card.textContent).toEqual('test axios1')

        // screen.logTestingPlaygroundURL();
        // expect(axios.get).toBeCalledTimes(1);
        // expect(catalog_heading.textContent).toBe('Catalog');

        // fireEvent.click(getByText('Cart'));
        // const heading = await waitFor(() => getByText('Shopping cart'))
        // expect(heading.textContent).toContain('cart');

        fireEvent.click(getByText('Catalog'));
        const cardHeading = await waitFor(() => getByText('Incredible Bike'))
        const cardPrice = cardHeading.nextElementSibling;
        expect(cardPrice.textContent).toContain('23');



        // const card = await waitFor(() => getByText(''));
        // expect(card.)
        // expect(axiosMock.get).toHaveBeenCalledTimes(1);
        // expect(axiosMock.get).toHaveBeenCalledWith(params);
        
    });
});
