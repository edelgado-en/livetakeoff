import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
);

