import React from "react";
import { Button, Container } from "react-bootstrap";
import CreateType from "../components/modals/CreateType";
import CreateBrand from "../components/modals/CreateBrand";
import CreateProduct from "../components/modals/CreateProduct";
import { useState } from "react";
import CompleteOrder from "../components/modals/CompleteOrder";

const Admin = () => {
  const [typeVisible, setTypeVisible] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);
  const [productVisible, setProductVisible] = useState(false);
  const [completeOrderVisible, setCompleteOrderVisible] = useState(false);

  const buttonStyle = {
  color: "rgb(143, 114, 222)",
  borderColor: "rgb(143, 114, 222)",
  borderWidth: "2px",
  fontWeight: "600",
  fontSize: "1.1rem",
  width: "800px", 
  transition: "all 0.3s ease",
};

  const buttonHover = (e) => {
    e.currentTarget.style.backgroundColor = "rgb(143, 114, 222)";
    e.currentTarget.style.color = "white";
  };

  const buttonLeave = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "rgb(143, 114, 222)";
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <Button
        variant="outline"
        className="mt-5 p-3"
        style={buttonStyle}
        onClick={() => setTypeVisible(true)}
        onMouseEnter={buttonHover}
        onMouseLeave={buttonLeave}
      >
        Add Type
      </Button>

      <Button
        variant="outline"
        className="mt-4 p-3"
        style={buttonStyle}
        onClick={() => setBrandVisible(true)}
        onMouseEnter={buttonHover}
        onMouseLeave={buttonLeave}
      >
        Add Brand
      </Button>

      <Button
        variant="outline"
        className="mt-4 p-3"
        style={buttonStyle}
        onClick={() => setProductVisible(true)}
        onMouseEnter={buttonHover}
        onMouseLeave={buttonLeave}
      >
        Add Product
      </Button>

      <Button
          variant="outline"
          className="mt-4 p-3"
          style={buttonStyle}
          onClick={() => setCompleteOrderVisible(true)}
          onMouseEnter={buttonHover}
          onMouseLeave={buttonLeave}
        >
          Complete Orders
        </Button>

      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateProduct
        show={productVisible}
        onHide={() => setProductVisible(false)}
      />
      <CompleteOrder
        show={completeOrderVisible}
        onHide={() => setCompleteOrderVisible(false)}
      />
    </Container>
  );
};

export default Admin;