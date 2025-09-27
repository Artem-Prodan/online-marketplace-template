// index.js
require("dotenv").config();

const app = require("./app");
const sequelize = require("./DB");

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: true });
    console.log("Models synced");

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.error("❌ Startup error:", e);
  }
};

start();
