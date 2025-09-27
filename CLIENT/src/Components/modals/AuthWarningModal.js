import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const AuthWarningModal = ({ show, onClose }) => {
  const [isHover, setIsHover] = useState(false);

  const baseStyle = {
    color: "rgb(143, 114, 222)",
    borderColor: "rgb(143, 114, 222)",
    backgroundColor: "transparent",
    borderWidth: "2px",
    fontWeight: "bold",
    padding: "0.375rem 1rem",
    borderRadius: "0.25rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const hoverStyle = {
    color: "white",
    backgroundColor: "rgb(143, 114, 222)",
    borderColor: "rgb(143, 114, 222)",
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Access Denied</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="d-flex align-items-center justify-content-center"
        style={{ gap: "10px" }}
      >
        <i
          className="fa-solid fa-circle-exclamation"
          style={{
            fontSize: "32px",
            color: "rgb(143, 114, 222)",
          }}
          aria-hidden="true"
        />
        <span>Please log in to access your cart.</span>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={onClose}
          style={isHover ? { ...baseStyle, ...hoverStyle } : baseStyle}
          variant="outline-primary"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AuthWarningModal;
