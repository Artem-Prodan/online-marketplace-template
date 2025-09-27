
import Admin from "./pages/Admin"
import OrderHistory from "./pages/OrderHistory"
import {
    ADMIN_ROUTE,
    LOGIN_ROUTE,
    PRODUCT_ROUTE,
    MARKET_ROUTE,
    REGISTRATION_ROUTE
 } from "./utils/consts"
import Market from "./pages/Market"
import Auth from "./pages/Auth"
import Product from "./pages/ProductPage"
import OrderDetails from "./pages/OrderDetails";

// only authorized users have access to next pages:
export const authRoutes = [
    {
      path: ADMIN_ROUTE,
      Component: Admin
    },
    {
    path: "/orders",
    Component: OrderHistory,
  },
  {
    path: "/orders/:id",
    Component: OrderDetails,
  }

   
]

export const publicRoutes = [
    {
      path: MARKET_ROUTE,
      Component: Market
    },

    {
      path: LOGIN_ROUTE,
      Component: Auth
    },

    {
      path: REGISTRATION_ROUTE,
      Component: Auth
    },

    {
      path: PRODUCT_ROUTE + "/:id",
      Component: Product
    }
]