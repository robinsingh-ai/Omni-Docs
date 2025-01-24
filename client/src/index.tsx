import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import { AppThemeProvider } from './services/AppThemeProvider';
import { BrowserRouter } from "react-router";
import AppRoutes from './routes';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppThemeProvider>
          <AppRoutes />
        </AppThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode >
);