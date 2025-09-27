import React, { useState, useEffect, useContext } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { Context } from "../index";
import AuthWarningModal from "../components/modals/AuthWarningModal";
import { getMyOrders, removeOrder } from "../http/orderAPI";
import { useNavigate } from "react-router-dom";

const OrderHistory = ({ isCartOpen }) => {
  const { user } = useContext(Context);
  const [orders, setOrders] = useState([]);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAuth) {
      getMyOrders()
        .then(setOrders)
        .catch(err => {
          console.error("Failed to load orders:", err);
        });
    }
  }, [user.isAuth]);

  const handleRemove = async (orderId) => {
    if (!user.isAuth) {
      setShowAuthWarning(true);
      return;
    }

    try {
      await removeOrder(orderId);
      const updated = await getMyOrders();
      setOrders(updated);
    } catch (err) {
      console.error("Failed to remove order:", err);
    }
  };

  const redButtonStyle = {
    color: "white",
    backgroundColor: "rgb(201, 0, 20)",
    borderColor: "rgb(184, 0, 18)",
    fontWeight: 600,
    transition: "all 0.3s ease",
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = "rgb(93, 0, 9)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "rgb(201, 0, 20)";
  };

  const containerStyle = {
    maxWidth: isCartOpen ? "800px" : "970px",
    margin: "0 auto",
    marginRight: isCartOpen ? "160px" : "240px",
    transition: "all 0.3s ease",
  };

  return (
    <Container className="d-flex flex-column align-items-center mt-4" style={containerStyle}>
      <h2 style={{ color: "rgb(143, 114, 222)", fontWeight: 650 }}>My Orders</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <Card
          key={order.id}
          className="mb-4 p-4 shadow-sm"
          style={{ maxWidth: "700px", width: "100%" }}
          onClick={() => navigate(`/orders/${order.id}`)}
        >
          <h5 className="mb-3">
            <span > Order <span style={{ color: "#8f72de", fontWeight: 600 }}> #{order.id}</span></span> — {order.status}
          </h5>

          <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
          <p><strong>Total:</strong> ${order.total}</p>
          <p><strong>Payment:</strong> {order.paymentStatus || "N/A"} ({order.paymentMethod || "N/A"})</p>

          <hr />

          <p><strong>Name:</strong> {order.fullName || "N/A"}</p>
          <p><strong>Phone:</strong> {order.phoneNumber || "N/A"}</p>
          <p><strong>Address:</strong> {order.address || "N/A"}</p>

          <hr />

          <h6>Items:</h6>
          <ul>
            {order.items?.map((item, index) => (
              <li key={index}>
                {item.name || item.product?.name} × {item.quantity} — ${item.price}
              </li>
            ))}
          </ul>

          {order.status === "Completed" && (
            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="danger"
                style={{
                  ...redButtonStyle,
                  padding: "8px 16px",
                  fontSize: "0.875rem",
                  borderRadius: "6px",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                e.stopPropagation();
                handleRemove(order.id);
              }}
              >
                Remove from History
              </Button>
            </div>
          )}
        </Card>
      ))}

      <AuthWarningModal
        show={showAuthWarning}
        onClose={() => setShowAuthWarning(false)}
      />
    </Container>
  );
};

export default OrderHistory;
