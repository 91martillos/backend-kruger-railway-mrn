//Para definir nuestro modelo, primero definimos el schema (tiene definiones de atributos del documento, tipos de datos y validaciones) del producto
//crear el model oclase del producto

import mongoose from "mongoose";

//coloco el atributo y luego el tipo de dato ( cuando son un solo atributo)
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El producto de ley debe ser titulado"],
    unique: true,
  },
  description: {
    type: String,
    minlenth: [5, "Minimo 5 caracteres"],
    maxlength: [50, "Maximo 50 caracteres"],
  },
  price: {
    type: Number,
    required: [true, "El precio es requerido"],
    min: [0, "El precio no puede ser negativo"],
    max: [100000, "El precio no puede ser mayor a 10000"],
  },
  category: {
    type: String,
    requiere: [true, "Debes especificar una categoria"],
  },
});

export const Product = mongoose.model("product", productSchema);
