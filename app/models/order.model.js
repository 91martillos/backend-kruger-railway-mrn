import mongoose from "mongoose";

//objeto que representa el esquema de la orden
//{
// user: "idDelUser",
// products: [
//    {
//       id: "idDelProducto que estamos comprando",
//      quantity: "qty que estamos comprando"
//    }
//    {
//        id: "idDelProducto que estamos comprando",
//        quantity: "qty que estamos comprando"
//    }
// ],
// comments: [
//    id: "idDelComentario","idDelComentario"
//]
//}
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
});

export const Order = mongoose.model("order", orderSchema);
