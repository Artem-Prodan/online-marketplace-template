import React, { useContext, useState } from "react";
import { Container, Row, Col, Image, Card, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { Context } from "../index";
import AuthWarningModal from "../components/modals/AuthWarningModal";

const Product = ({ isCartOpen }) => {
  const { cart, user } = useContext(Context);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const product = {
    id: 1,
    name: "Straight Leg",
    brand: "Levi's",
    type: "Jeans",
    price: 119,
    rating: 5,
    img: "C:\\Users\\PC\\Desktop\\SoftwareEng\\buying_selling_market\\Server\\static\\f64280c1-128c-47ce-9297-e2153cd83cf0.jpg",
  };

  const description = [
    { id: 1, title: "Color", description: "Classic Black" },
    { id: 2, title: "Material", description: "100% Cotton Denim" },
    { id: 3, title: "Fit", description: "Regular fit with straight leg cut" },
    { id: 4, title: "Closure", description: "Zip fly with button fastening" },
    { id: 5, title: "Care", description: "Machine wash cold, tumble dry low" },
  ];

  const grayStarSVG = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="rgba(146, 146, 146, 0.47)">
      <polygon points="32 4 39.09 24.26 60 24.26 42.18 38.14 49.27 58.4 32 44.52 14.73 58.4 21.82 38.14 4 24.26 24.91 24.26 32 4"/>
    </svg>
  `);

  const handleAddToCart = () => {
    if (!user.isAuth) {
      setShowAuthWarning(true);
      return;
    }
    cart.addToCart(product);
  };

  const containerStyle = {
    maxWidth: isCartOpen ? "800px" : "970px",
    transition: "all 0.3s ease",
    margin: "0 auto",
    marginRight: isCartOpen ? "160px" : "240px",
  };

  return (
    <Container className="mt-4" style={containerStyle}>
      <Row className="mb-4">
        <Col md={isCartOpen ? 3 : 4} className="d-flex justify-content-center">
          <Image
            width={isCartOpen ? 220 : 300}
            height={isCartOpen ? 220 : 300}
            src={product.img}
            style={{ objectFit: "cover", borderRadius: "10px" }}
          />
        </Col>

        <Col
          md={isCartOpen ? 3 : 4}
          className="d-flex flex-column align-items-center justify-content-start"
        >
          <h2
            className="text-center mb-3"
            style={{ fontWeight: "700", fontSize: isCartOpen ? "22px" : "28px" }}
          >
            {product.name}
          </h2>

          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              backgroundImage: `url("data:image/svg+xml,${grayStarSVG}")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
              width: isCartOpen ? "180px" : "260px",
              height: isCartOpen ? "180px" : "260px",
              fontSize: isCartOpen ? "32px" : "42px",
              fontWeight: "bold",
              color: "black",
              position: "relative",
              userSelect: "none",
            }}
          >
            <FaStar
              style={{
                marginRight: "7px",
                position: "relative",
                zIndex: 1,
                color: "rgba(144, 103, 255, 0.8)",
              }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>{product.rating}</span>
          </div>
        </Col>

        <Col
          md={isCartOpen ? 6 : 4}
          className="d-flex align-items-center justify-content-center"
        >
          <Card
            style={{
              width: "100%",
              maxWidth: "300px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Card.Body className="text-center">
              <Card.Title style={{ fontSize: "24px", fontWeight: "600" }}>
                ${product.price}
              </Card.Title>

              <Button
                style={{
                  marginTop: "15px",
                  color: "rgb(143, 114, 222)",
                  borderColor: "rgb(143, 114, 222)",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                variant="outline"
                onClick={handleAddToCart}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgb(143, 114, 222)";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "rgb(143, 114, 222)";
                }}
              >
                Add to Cart
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <h4 style={{ fontWeight: "600", marginBottom: "10px" }}>Characteristics</h4>
          <div style={{ borderRadius: "8px", overflow: "hidden" }}>
            {description.map((item, index) => (
              <Row
                key={item.id}
                style={{
                  padding: "10px 15px",
                  backgroundColor: index % 2 === 0 ? "rgba(200, 200, 200, 0.57)" : "transparent",
                }}
              >
                <Col md={4} style={{ fontWeight: "500" }}>
                  {item.title}:
                </Col>
                <Col md={8}>{item.description}</Col>
              </Row>
            ))}
          </div>
        </Col>
      </Row>

      <AuthWarningModal show={showAuthWarning} onClose={() => setShowAuthWarning(false)} />
    </Container>
  );
};

export default Product;
