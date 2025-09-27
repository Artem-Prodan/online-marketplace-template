import React from "react";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "..";
import { Row, Col, Card } from "react-bootstrap";

const BrandBar = observer(() => {
  const { product } = useContext(Context);

  return (
    <Row className="d-flex flex-row flex-nowrap overflow-auto">
      {product.brands.map((brand) => {
        const isActive = brand.id === product.selectedBrand?.id;
        return (
          <Col key={brand.id} xs="auto" className="p-2">
            <Card
              className="p-3"
              style={{
                whiteSpace: "nowrap",
                cursor: "pointer",
                border: isActive ? "2px solid rgb(143, 114, 222)" : "1px solid #ddd",
                color: isActive ? "rgb(143, 114, 222)" : "inherit",
                fontWeight: isActive ? "600" : "normal",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                userSelect: "none",
              }}
              onClick={() => product.setSelectedBrand(brand)}
            >
              {brand.name}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
});

export default BrandBar;

