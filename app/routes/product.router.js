import express from "express";
import { getAllProducts } from "../controllers/product.controller.js";
import {
  saveProduct,
  updateProduct,
  getOneProduct,
  deleteProduct,
  findProductsByFilters,
  getProductsStatistics,
} from "../controllers/product.controller.js";
import authtenticationMiddleware from "../middlewares/authtentication.middleware.js";
import authorizationMiddleware from "../middlewares/authorization.middleware.js";

const router = express.Router();

router.use(authtenticationMiddleware);

//vams a definir que role puede acceder a cada uno de los servicios
router.get(
  "/",
  authorizationMiddleware(["admin", "author", "user"]),
  getAllProducts
); //pueden acceder todos
router.post("/", authorizationMiddleware(["admin", "author"]), saveProduct); //acceso para admin y author
router.put("/:id", authorizationMiddleware(["admin", "author"]), updateProduct); //acceso para admin y author
router.get(
  "/by-filters",
  authorizationMiddleware(["admin", "author", "user"]),
  findProductsByFilters
); //acceso para todos
router.get(
  "/statistics",
  authorizationMiddleware(["admin", "author", "user"]),
  getProductsStatistics
); //acceso para todos
router.get("/:id", getOneProduct);
router.delete("/:id", deleteProduct); //acceso para admin
export default router;
