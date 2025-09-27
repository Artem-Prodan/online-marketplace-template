export const placeOrder = async (order) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");

      const total = order.items.reduce((sum, item) => {
        return sum + (item.price || 0) * item.quantity;
      }, 0);

      const newOrder = {
        id: Date.now(),
        ...order, // fullName, phoneNumber, address, items
        date: new Date().toISOString(),
        status: "Processing",
        total,
        paymentStatus: "Pending",
        paymentMethod: "Credit Card"
      };

      localStorage.setItem("orders", JSON.stringify([...existingOrders, newOrder]));
      resolve({ message: "Order stored in localStorage" });
    }, 1000);
  });
};


export const getMyOrders = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem("orders") || "[]");
      resolve(stored);
    }, 500);
  });
};

export const removeOrder = async (orderId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const updatedOrders = existingOrders.filter(order => order.id !== orderId);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      resolve({ message: "Order removed from history" });
    }, 500);
  });
};

export const getOrderById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const found = orders.find(order => order.id === parseInt(id));
      if (found) {
        resolve(found);
      } else {
        reject(new Error("Order not found"));
      }
    }, 500);
  });
};

