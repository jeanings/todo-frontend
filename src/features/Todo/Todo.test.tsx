import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Todo from './Todo';

test('renders Todo component', () => {
  render(
    <Provider store={store}>
      <Todo />
    </Provider>
  );

  expect(screen.getByRole('main', { name: 'todo container' })).toBeInTheDocument();
});
