import React, { useState, useContext } from "react";
import "./OrderModal.css";
import { placeOrder, getMyOrders } from "../../http/orderAPI";
import { Button } from "react-bootstrap";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const OrderModal = ({ onClose, onSuccess }) => {
  const { cart } = useContext(Context);
  const cartItems = cart.cartItems;

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async () => {
    if (!fullName || !phoneNumber || !address) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const orderItems = cartItems
        .filter(i => i.product && i.quantity)
        .map(i => ({
          productId: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
          name: i.product.name,
        }));

      await placeOrder({
        fullName,
        phoneNumber,
        address,
        items: orderItems,
      });

      alert("Order placed successfully!");
      cart.clearCart();

      const updatedOrders = await getMyOrders();
      onSuccess(updatedOrders);

      onClose();
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const placeOrderStyle = {
    color: "rgb(143, 114, 222)",
    borderColor: "rgb(143, 114, 222)",
    fontWeight: 600,
    transition: "all 0.3s ease",
  };

  const cancelStyle = {
    fontWeight: 600,
  };

  const handlePlaceHover = (e) => {
    e.currentTarget.style.backgroundColor = "rgb(143, 114, 222)";
    e.currentTarget.style.color = "white";
  };

  const handlePlaceLeave = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "rgb(143, 114, 222)";
  };

  return (
    <div className="order-modal">
      <div className="order-modal-content">
        <h3>Order Information</h3>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
        />
        <textarea
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <div className="order-modal-buttons">
          <Button
            variant="outline"
            onClick={handleSubmit}
            style={placeOrderStyle}
            onMouseEnter={handlePlaceHover}
            onMouseLeave={handlePlaceLeave}
          >
            Place Order
          </Button>
          <Button
            variant="outline-dark"
            onClick={onClose}
            style={cancelStyle}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default observer(OrderModal);
