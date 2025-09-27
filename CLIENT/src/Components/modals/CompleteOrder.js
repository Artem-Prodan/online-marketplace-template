// src/components/modals/CompleteOrder.js
import React, { useEffect, useState } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import "./Modals.css";

const CompleteOrder = ({ show, onHide }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (show) {
      // upload orders from localStorage
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(storedOrders);
    }
  }, [show]);

  const completeOrder = (id) => {
    const updatedOrders = orders.map(order => {
      if (order.id === id) {
        return { ...order, status: "Completed" };
      }
      return order;
    });

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  const purpleButtonStyle = {
    color: "rgb(143, 114, 222)",
    borderColor: "rgb(143, 114, 222)",
    fontWeight: 600,
    transition: "all 0.3s ease",
    marginLeft: "10px",
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = "rgb(143, 114, 222)";
    e.currentTarget.style.color = "white";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "rgb(143, 114, 222)";
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered  dialogClassName="custom-modal-z">
      <Modal.Header closeButton>
        <Modal.Title>Complete Orders</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {orders.length === 0 && <p>No orders found.</p>}
        <ListGroup>
          {orders.map(order => (
            <ListGroup.Item key={order.id} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Order #{order.id}</strong> — Status: {order.status}
              </div>
              {order.status !== "Completed" && (
                <Button
                  variant="outline"
                  style={purpleButtonStyle}
                  onClick={() => completeOrder(order.id)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Complete
                </Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-dark"
          onClick={onHide}
          style={{ fontWeight: 600 }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompleteOrder;
