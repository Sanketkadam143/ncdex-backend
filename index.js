import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import products from "./routes/products.js";
import authRoutes from "./routes/admin.js";
import productDetails from "./routes/productDetails.js";
import connection from "./config/dbconnection.js";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
const db = connection();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/api/admin", authRoutes);
app.use("/api/admin",products);
app.use("/api/products",productDetails);

app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}`)
);

process.on('SIGINT', () => {
  console.log('Closing connection...');
  db.end();
  process.exit();
});


