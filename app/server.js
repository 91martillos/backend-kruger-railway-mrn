//vamos a crear los sevidores del proyecto con http

import express from "express";
import { connectDB } from "./db/db.js";
import productRoutes from "./routes/product.router.js";
import userRoutes from "./routes/user.router.js";
import config from "./configs/configs.js";
import authRoutes from "./routes/auth.router.js";
import logsRoutes from "./routes/logs.router.js";
import createOrder from "./routes/order.router.js";
import cors from "cors";

const app = express();

//middleware para parsear el body con JSON
app.use(express.json());
app.use(cors());

connectDB();

app.use("/products", productRoutes); //agregamos las rutas
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/logs", logsRoutes);
app.use("/orders", createOrder);
app.listen(config.PORT, () => {
  console.log(`Server corriendin on por ${config.PORT}`);
});
