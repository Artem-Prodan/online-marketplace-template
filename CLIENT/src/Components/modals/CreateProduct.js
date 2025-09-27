import React, { useContext, useRef, useState } from "react";
import { Modal, Button, Form, Dropdown, Row, Col } from "react-bootstrap";
import { Context } from "../..";
import "./Modals.css";

const CreateProduct = ({ show, onHide }) => {
  const { product } = useContext(Context);
  const [info, setInfo] = useState([]);

  const addInfo = () => {
    setInfo([...info, { title: "", description: "", number: Date.now() }]);
  };

  const removeInfo = (number) => {
    setInfo(info.filter((i) => i.number !== number));
  };

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("No file chosen");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("No file chosen");
    }
  };

  const purpleButtonStyle = {
    color: "rgb(143, 114, 222)",
    borderColor: "rgb(143, 114, 222)",
    fontWeight: 600,
    transition: "all 0.3s ease",
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = "rgb(143, 114, 222)";
    e.currentTarget.style.color = "white";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "rgb(143, 114, 222)";
  };

  const closeButtonStyle = {
    fontWeight: 600,
  };

  const redButtonStyle = {
    backgroundColor: "transparent",
    borderColor: "rgb(184, 0, 18)",
    color: "rgb(201, 0, 20)",
    fontWeight: 600,
    transition: "all 0.3s ease",
  };

  const redHoverEnter = (e) => {
    e.currentTarget.style.backgroundColor = "rgb(201, 0, 20)";
    e.currentTarget.style.color = "white";
  };

  const redHoverLeave = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "rgb(201, 0, 20)";
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered  dialogClassName="custom-modal-z">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create new Product
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Dropdown className="mt-3">
            <Dropdown.Toggle
              style={{ ...purpleButtonStyle, backgroundColor: "transparent" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              choose the type
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {product.types.map((type) => (
                <Dropdown.Item key={type.id}>{type.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="mt-3">
            <Dropdown.Toggle
              style={{ ...purpleButtonStyle, backgroundColor: "transparent" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              choose the brand
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {product.brands.map((brand) => (
                <Dropdown.Item key={brand.id}>{brand.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Form.Control className="mt-3" placeholder="enter Product name" />
          <Form.Control
            className="mt-3"
            placeholder="enter Product price"
            type="number"
          />

          <div className="mt-3 d-flex align-items-center">
            <Button
              variant="outline"
              style={purpleButtonStyle}
              onClick={() => fileInputRef.current.click()}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Choose file
            </Button>
            <span style={{ marginLeft: "10px" }}>{fileName}</span>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          <hr style={{ border: "1px solid black" }} />

          <Button
            variant="outline-dark"
            onClick={addInfo}
            style={{ fontWeight: 600 }}
          >
            Create new Characteristic
          </Button>

          {info.map((i) => (
            <Row className="mt-3" key={i.number}>
              <Col md={4}>
                <Form.Control placeholder="enter title" />
              </Col>
              <Col md={4}>
                <Form.Control placeholder="enter description" />
              </Col>
              <Col md={4}>
                <Button
                  style={redButtonStyle}
                  onMouseEnter={redHoverEnter}
                  onMouseLeave={redHoverLeave}
                  onClick={() => removeInfo(i.number)}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-dark"
          onClick={onHide}
          style={closeButtonStyle}
        >
          Close
        </Button>
        <Button
          variant="outline"
          onClick={onHide}
          style={purpleButtonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateProduct;
