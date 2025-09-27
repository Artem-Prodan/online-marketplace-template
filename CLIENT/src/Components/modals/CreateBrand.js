import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./Modals.css";

const CreateBrand = ({ show, onHide }) => {
  const createButtonStyle = {
    color: "rgb(143, 114, 222)",
    borderColor: "rgb(143, 114, 222)",
    fontWeight: 600,
    transition: "all 0.3s ease",
  };

  const closeButtonStyle = {
    fontWeight: 600,
  };

  const handleCreateHover = (e) => {
    e.currentTarget.style.backgroundColor = "rgb(143, 114, 222)";
    e.currentTarget.style.color = "white";
  };
  const handleCreateLeave = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "rgb(143, 114, 222)";
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered  dialogClassName="custom-modal-z">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create new Brand
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control placeholder={"enter Brand name"} />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={onHide} style={closeButtonStyle}>
          Close
        </Button>
        <Button
          variant="outline"
          onClick={onHide}
          style={createButtonStyle}
          onMouseEnter={handleCreateHover}
          onMouseLeave={handleCreateLeave}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBrand;
