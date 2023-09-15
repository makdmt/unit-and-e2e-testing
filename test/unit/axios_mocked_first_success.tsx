import React from 'react';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Application } from '../../src/client/Application'

import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';

import events from "@testing-library/user-event";

import { render, screen } from '@testing-library/react';
import axios from 'axios';

// const axios = require('axios');
// import events from '@testing-library/react';
// import events from '@testing-library/dom';
// import events from '@testing-library/user-event';


jest.mock('axios');

describe('Simple Test Case', () => {
    it('Should return 4', async () => {

        const basename = '/hw/store';
        const api = new ExampleApi(basename);
        const cart = new CartApi();
        const store = initStore(api, cart);

        const application = (
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        );

        const { container, getByTestId } = render(application);

        // function timeout(ms) {
        //     return new Promise(resolve => setTimeout(resolve, ms));
        // }

        // const productCard = getByTestId('burger-btn');

        await events.click(getByTestId("uugg"));

        const catalog_heading = await screen.findByTestId('CatHead')

       

        // (axios.get as jest.Mock).mockResolvedValueOnce(prods);
        // mockReturnValue(prods)

        console.log(catalog_heading.textContent);
        // await timeout(2000);

        const card = await screen.findByText('test axios1')

        console.log(card.textContent);

        expect(card.textContent).toEqual('test axios1')

        // const productCard = getByTestId('burger-btn');

        // events.



        // console.log(container.outerHTML);
        // console.log(productCard.innerHTML);
        // screen.logTestingPlaygroundURL();


        // expect(axios.get).toBeCalledTimes(1);
        

// 

// 
        // expect(catalog_heading.textContent).toBe('Catalog');
    });
});
