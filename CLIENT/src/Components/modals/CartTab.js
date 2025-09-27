import React, { useContext, useState } from "react";
import CartList from "../CartList";
import "./CartTab.css";
import { Context } from "../..";
import OrderModal from "./OrderModal";
import EmptyOrderWarningModal from "./EmptyOrderWarning";

const CartTab = ({ isOpen, onClose }) => {
  const { cart } = useContext(Context);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [showEmptyOrderModal, setShowEmptyOrderModal] = useState(false);

  const handleProcessOrderClick = () => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      setShowEmptyOrderModal(true);
    } else {
      setOrderModalOpen(true);
    }
  };

  return (
    <div className={`cart-tab ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>&times;</button>
      <h2>Your Cart</h2>
      <div className="cart-list-container">
        <CartList />
      </div>

      <button
        className="process-order-btn"
        onClick={handleProcessOrderClick}
      >
        Process the Order
      </button>

      {isOrderModalOpen && (
        <OrderModal
          cartItems={cart.cartItems}
          onClose={() => setOrderModalOpen(false)}
          onSuccess={onClose}
          clearCart={cart.clearCart}
        />
      )}

      {showEmptyOrderModal && (
        <EmptyOrderWarningModal 
        show={true}
        onClose={() => setShowEmptyOrderModal(false)} />
      )}
    </div>
  );
};

export default CartTab;
