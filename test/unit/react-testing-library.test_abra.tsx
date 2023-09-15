import React from 'react';
import 'jest-dom/extend-expect';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Application } from '../../src/client/Application'

import events from "@testing-library/user-event";

import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';



//import events from "@testing-library/user-event";

import { render, screen } from '@testing-library/react';
 
import axios from 'axios';



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




    const { container, getByText } = render(application);


    // expect function from jest-dom
   
   // expect(getByText('Catalog')).toHaveTextContent('Hello');
   // expect(getByText('Catalog')).toHaveClass('')


    await events.click(getByText("Catalog"));

    const catalog_heading = await screen.findByTestId('CatHead')


    const card = await screen.findByText('test axios1')


    expect(card.textContent).toEqual('test axios1')

    // screen.logTestingPlaygroundURL();
    // expect(axios.get).toBeCalledTimes(1);
    // expect(catalog_heading.textContent).toBe('Catalog');
});