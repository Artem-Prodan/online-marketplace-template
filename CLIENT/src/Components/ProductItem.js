import React, { useContext, useState } from "react";
import { Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PRODUCT_ROUTE } from "../utils/consts";
import { Context } from "../index";
import { FaRegStar, FaPlusCircle } from "react-icons/fa";
import AuthWarningModal from "./modals/AuthWarningModal";

const ProductItem = ({ product }) => {
  const { cart, user } = useContext(Context);
  const navigate = useNavigate();
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user.isAuth) {
      setShowAuthWarning(true);
      return;
    }
    cart.addToCart(product);
  };

  return (
    <>
      <Col
        md={4}
        onClick={() => navigate(PRODUCT_ROUTE + "/" + product.id)}
        className="d-flex justify-content-center"
        style={{ cursor: "pointer" }}
      >
        <Card
          style={{
            textAlign: "left",
            width: "90%",
            margin: "10px",
            height: "340px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Card.Img
            variant="top"
            src={product.img}
            style={{
              height: "245px",
              objectFit: "cover",
              width: "100%",
            }}
          />
          <Card.Body
            style={{
              padding: "10px",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: "8px",
                gap: "10px",
              }}
            >
              <span
                style={{
                  backgroundColor: "#e0e0e0",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  color: "#333",
                  minWidth: "60px",
                  textAlign: "center",
                }}
              >
                {product.brand}
              </span>

              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "16px",
                  fontWeight: 500,
                  marginLeft: "40px",
                  color: "#7a66ba",
                }}
              >
                {product.rating}
                <FaRegStar
                  style={{
                    color: "black",
                    marginLeft: "6px",
                    fontSize: "18px",
                  }}
                />
              </span>

              <FaPlusCircle
                onClick={handleAddToCart}
                style={{
                  cursor: "pointer",
                  color: "#8f72de",
                  fontSize: "20px",
                  marginLeft: "auto",
                }}
                title="Add to cart"
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto",
                marginBottom: "10px",
              }}
            >
              <Card.Title style={{ fontSize: "18px", color: "#000", margin: 0 }}>
                {product.name}
              </Card.Title>
              <Card.Text style={{ fontSize: "14px", color: "#555", margin: 0 }}>
                ${product.price}
              </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <AuthWarningModal show={showAuthWarning} onClose={() => setShowAuthWarning(false)} />
    </>
  );
};

export default ProductItem;
