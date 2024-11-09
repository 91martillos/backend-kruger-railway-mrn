//aqui vamosa a definir el grupo de rutas para manejar nuestras ordenes
import express from "express";
import {
  createOrder,
  getOrdersByUserId,
  addCommentToOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder);
//servicio post para obtener el listado de ordenes por userId
router.get("/:userId", getOrdersByUserId);
//vamos a crear un nuevo sevicio para agregar comentarios a una orden
//Primero necesito la orden a la cual vanos a agregar los comentarios => id de la orden
//Que vamos a recibir un path param
router.post("/:orderId/comment", addCommentToOrder);

export default router;
