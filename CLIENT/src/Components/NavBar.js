import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { ADMIN_ROUTE, LOGIN_ROUTE, MARKET_ROUTE } from "../utils/consts";
import CartTab from "./modals/CartTab";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AuthWarningModal from "./modals/AuthWarningModal";

const styles = {
  logoLink: {
    color: "white",
    fontWeight: "bold",
    fontSize: "1.4rem",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
  cartButton: {
    backgroundColor: "white",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "black",
    border: "none",
    marginLeft: "1rem",
  },
};

const NavBar = observer(({ cartOpen, setCartOpen }) => {
  const { user, cart } = useContext(Context);

  const [showAuthWarning, setShowAuthWarning] = useState(false);
  
  const totalItems = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navigate = useNavigate();

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    navigate(LOGIN_ROUTE);
  };

  return (
    <>
      <style>{`
        .logo-link:hover {
          color:rgb(143, 114, 222) !important;
        }
        .cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: red;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          pointer-events: none;
          user-select: none;
          z-index: 10;
        }
        .cart-button-wrapper {
          position: relative;
          display: inline-block;
        }
      `}</style>

      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <NavLink
            to={MARKET_ROUTE}
            style={styles.logoLink}
            className="logo-link"
          >
            Logo / MarketName
          </NavLink>

          <Nav className="ms-auto d-flex align-items-center">
            {user.isAuth ? (
              <>
                <Button
                  variant="outline-light"
                  className="me-4"
                  onClick={() => navigate(ADMIN_ROUTE)}
                >
                  Admin Panel
                </Button>

                <Button variant="outline-light"
                className="me-4" 
                onClick={() => navigate("/orders")}>
                  My Orders
                </Button>

                <Button variant="outline-light" onClick={logOut}>
                  Log Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline-light"
                onClick={() => navigate(LOGIN_ROUTE)}
              >
                Authorization
              </Button>
            )}

            <div className="cart-button-wrapper" style={{ marginLeft: "1rem" }}>
              <button
                style={styles.cartButton}
                
                onClick={() => {
                  if (user.isAuth) {
                    setCartOpen(true);
                  } else {
                    setShowAuthWarning(true);
                  }
                }}

                title="Open cart"
              >
                <i className="fa-solid fa-bag-shopping" style={{ fontSize: "20px" }}></i>
              </button>
             {user.isAuth && totalItems > 0 && (
                <div className="cart-badge" style={{ margin: "1.45rem", marginTop: "20px" }}>
                  {totalItems}
                </div>
              )}
            </div>
          </Nav>
        </Container>
      </Navbar>

      {user.isAuth && (
        <CartTab isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      )}
      <AuthWarningModal show={showAuthWarning} onClose={() => setShowAuthWarning(false)} />
    </>
  );
});

export default NavBar;
