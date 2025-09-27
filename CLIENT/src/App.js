import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <BrowserRouter>
      <NavBar cartOpen={cartOpen} setCartOpen={setCartOpen} />
      <div
        style={{
          transform: cartOpen ? "translateX(-300px)" : "translateX(0)",
          transition: "transform 0.3s ease",
        }}
      >
        <AppRouter cartOpen={cartOpen} />
      </div>
    </BrowserRouter>
  );
};

export default App;
