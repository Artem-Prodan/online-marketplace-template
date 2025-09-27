// CartStore.js
import { makeAutoObservable } from "mobx";

export default class CartStore {
  cartItems = []; // { product, quantity }

  constructor() {
    makeAutoObservable(this);
  }

  addToCart(product) {
      console.log("Adding product id:", product.id);
    const item = this.cartItems.find(i => i.product.id === product.id);
    if (item) {
      item.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
  }

  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter(i => i.product.id !== productId);
  }

  increaseQuantity(productId) {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      item.quantity += 1;
    }
  }

  decreaseQuantity(productId) {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
    } else if (item) {
      this.removeFromCart(productId);
    }
  }

  get totalPrice() {
    return this.cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  }

  clearCart() {
  this.cartItems = [];
}
}


