import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Comment } from "../models/comment.model.js";

const createOrder = async (req, res) => {
  try {
    //Primer paso, para crear la orden; primero necesitamos calcular el total
    const { products, userId, comments } = req.body;

    //calcular el precio de la orden, vamosa acrear una variable qe se llame let totalPrice. En productos lo vamosa a recibir asi: [{id: 1, quantity: 2}, {id: 2, quantity: 3}]
    //vamos a crear la funcion para que calcule el total de la orden(let totalPrice = 0;)
    let totalPrice = 0;
    //primer paso del primer paso: iterar los productos
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      //segundo paso del primer paso: buscar el precio del producto (aqui busca de toda la base de datos solo el precio )
      const productPrice = await Product.findById(product.product);
      //tercer paso del primer paso: calcular el total
      totalPrice += productPrice.price * product.quantity;
    }

    // EL segundo paso es crear la orden
    const order = new Order({
      user: userId,
      products,
      comments,
      totalPrice,
    });
    await order.save();

    res.status(201).json({ message: "Orden creada", order });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//crear un servicio para obtener el listado de ordenes por el userId
const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("products.product")
      .populate("user")
      .populate("comments")
      .exec();
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .send({ message: "No hay ordenes para ese usuario" });
    }
    res.json({ message: "Listado de ordenes", orders });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//vamos a crear una funcion para agregar comentarios a una orden
const addCommentToOrder = async (req, res) => {
  try {
    //primero vamos a obtener el id de la orden de nuestro path param
    const { orderId } = req.params;
    //Luego necesitamos saber el id del usuario que esta haciendo el comment
    //NEcesitamosa el mensaje o comment que escribio el user
    //Esto lo vamosa a obrener del cuerpo de la peticion => del req.body
    const { userId, message } = req.body;
    //Vamosa  crear el comentario en nuestra base de datos
    const comment = new Comment({
      user: userId,
      message,
    });
    //Guardamos el comment en la base de datos
    await comment.save();
    //Vamos a agregar y relacionar el comment a la orden
    //primero necesito buscar la orden con el id que recibimos en el path param
    const order = await Order.findById(orderId);
    //validamos si la orden no existe
    if (!order) {
      return res.status(404).json({ message: "No hay esa orden Paps" });
    }
    //comments es un array de objetos: ["id comentario1", "id comentario2"]
    //vamos a asociar el comment a la orden que acabamos de encontrar
    order.comments.push(comment._id);
    //vamos a guardar la orden en la base de datos
    //transacciones permiten trabajar situaciones al momento de trabajar con dos documentos a la vez, es como hacer un control+z
    await order.save();
    res
      .status(201)
      .json({ message: "Comentario agregado a la orde Paps", comment });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export { createOrder, getOrdersByUserId, addCommentToOrder };
