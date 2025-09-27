import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { createContext } from 'react';
import UserStore from './store/userStore';
import ProductStore from './store/productStore';
import CartStore from './store/CartStore';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value ={{
    user: new UserStore(),
    product: new ProductStore(),
    cart: new CartStore(),
  }}>
   <App />
  </Context.Provider>
  
);


