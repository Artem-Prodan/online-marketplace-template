import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import ProductList from "../components/productList";

const Market = ({ cartOpen }) => {
  return (
    <Container>
      <Row className="mt-4">
        <Col md={3}>
          <TypeBar cartOpen={cartOpen} />
        </Col>
       
        <Col md={9}>
          <BrandBar cartOpen={cartOpen} />
          <ProductList cartOpen={cartOpen} />
        </Col>
      </Row>
    </Container>
  );
};

export default Market;

