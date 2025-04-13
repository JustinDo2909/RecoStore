const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const productRouter = require("./router/product.router");
const CategoryRouter = require("./router/category.router");
const OrderRouter = require("./router/order.router");
const userRouter = require("./router/user.router");
const CartRouter = require("./router/cart.router");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/product", productRouter);

app.use("/category", CategoryRouter);
app.use("/auth", userRouter);
app.use("/order", OrderRouter);
app.use("/cart", CartRouter);
mongoose
  .connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@exe2fashion.gclrrba.mongodb.net/`)

  .then(() => {
    console.log("Connected to DB");
    app.listen(process.env.PORT, () => {
      console.log(`App is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Connection failed:", error.message);
  });
