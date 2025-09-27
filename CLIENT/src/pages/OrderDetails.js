import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../http/orderAPI";
import { Container, Card } from "react-bootstrap";
import ProgressTracker from "../components/OrderProgress";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!order) return <p>Loading order details...</p>;

  const estimatedDelivery = new Date(order.date);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h4 className="mb-3">
            <span > Order <span style={{ color: "#8f72de", fontWeight: 650 }}> #{order.id}</span></span> — {order.status}
          </h4>
        <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ${order.total}</p>

        <hr />
        <h5>Products Ordered:</h5>
        <div className="d-flex flex-wrap gap-4 mb-3">
          {order.items?.map((item, index) => (
            <div key={index} style={{ width: 150 }}>
              <img
                src={item.product?.img || "/default.png"}
                alt={item.product?.name || item.name}
                style={{ width: "100%", height: "auto", borderRadius: 8 }}
              />
              <p>{item.product?.name || item.name}</p>
              <p>Quantity: {item.quantity} — ${item.price}</p>
            </div>
          ))}
        </div>

        <hr />
        <p><strong>Full Name:</strong> {order.fullName}</p>
        <p><strong>Phone:</strong> {order.phoneNumber}</p>
        <p><strong>Address:</strong> {order.address}</p>

        <hr />
        <p><strong>Payment:</strong> {order.paymentMethod} — {order.paymentStatus}</p>
        <p><strong>Tracking Number:</strong> {order.trackingNumber || "N/A"}</p>

        <h6 className="mt-4">Progress:</h6>
        <ProgressTracker currentStatus={order.status} />

        <p><strong>Estimated Delivery:</strong> {estimatedDelivery.toLocaleDateString()}</p>
      </Card>
    </Container>
  );
};


export default OrderDetails;
