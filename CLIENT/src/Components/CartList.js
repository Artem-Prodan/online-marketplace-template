import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const CartList = observer(() => {
  const { cart } = useContext(Context);

  if (cart.cartItems.length === 0) {
    return <div style={{ padding: "10px" }}>Cart is Empty
    </div>;
  }

  return (
    <div style={{ padding: "10px" }}>
      {cart.cartItems.map(({ product, quantity }) => (
        <div
          key={product.id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px",
          }}
        >
          <img
            src={product.img}
            alt={product.name}
            style={{ width: "60px", height: "60px", objectFit: "cover", marginRight: "10px" }}
          />
          <div style={{ flexGrow: 1 }}>
            <div style={{ fontWeight: "bold" }}>{product.name}</div>
          </div>

          <div style={{ minWidth: "90px", textAlign: "right" }}>
            ${ (product.price * quantity).toFixed(2) }
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "15px",
              gap: "5px",
            }}
          >
            <button onClick={() => cart.decreaseQuantity(product.id)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => cart.increaseQuantity(product.id)}>+</button>
          </div>
        </div>
      ))}

      <div
        style={{
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "right",
          marginTop: "15px",
          borderTop: "2px solid #8f72de",
          paddingTop: "10px",
          color: "#8f72de",
        }}
      >
        Total: ${cart.totalPrice.toFixed(2)}
      </div>
    </div>
  );
});

export default CartList;
