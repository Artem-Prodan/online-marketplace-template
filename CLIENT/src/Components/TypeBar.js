import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "..";
import ListGroup from "react-bootstrap/ListGroup";

const TypeBar = observer(({ cartOpen }) => {
  const { product } = useContext(Context);

  return (
    <ListGroup
      style={{
        maxHeight: "200px",
        maxWidth: cartOpen ? "120px" : "250px",
        marginLeft: cartOpen ? "122px" : "-20px",
        transition: "all 0.3s ease",
        transform: cartOpen ? "translateX(50px)" : "translateX(0)", // сдвигаем вправо при открытой корзине
      }}
    >
      {product.types.map((type) => (
        <ListGroup.Item
          key={type.id}
          style={{
            display: "flex",
            justifyContent: cartOpen ? "flex-end" : "center",
            alignItems: "center",
            cursor: "pointer",
            paddingRight: cartOpen ? "8px" : "0",
            paddingLeft: 0,
            whiteSpace: "nowrap",
            color:
              product.selectedType?.id === type.id
                ? "rgb(143, 114, 222)"
                : undefined,
            fontWeight: product.selectedType?.id === type.id ? "600" : "normal",
            border:
              product.selectedType?.id === type.id
                ? "2px solid rgb(143, 114, 222)"
                : "none",
            borderRadius: product.selectedType?.id === type.id ? "8px" : "0",
            transition: "all 0.3s ease",
          }}
          active={false}
          onClick={() => product.setSelectedType(type)}
          title={type.name}
        >
          {type.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
});

export default TypeBar;
