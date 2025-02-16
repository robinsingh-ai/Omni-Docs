import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { AppThemeProvider } from './services/AppThemeProvider';
import { BrowserRouter } from "react-router";
import AppRoutes from './routes';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={
        <div>Loading...</div>
      } persistor={persistor}>
        <BrowserRouter>
          <AppThemeProvider>
            <AppRoutes />
          </AppThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode >
);