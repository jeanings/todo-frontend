import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import App from './App';


test('renders main App component', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});

test('initiates initial store states', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(store.getState().todo).toEqual({
    status: 'uninitialized',
    solid: null,
    red: null,           
    amber: null, 
    green: null,
    transparent: null,
    showOnly: 'all'
  });
});
