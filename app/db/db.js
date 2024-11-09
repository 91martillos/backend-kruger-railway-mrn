import mongoose from "mongoose";

export const connectDB = async () => {
  //al string de conexion agregamos el parametro que es el nombre de la base de datos (en este caso(products)
  try {
    await mongoose.connect(
      "mongodb+srv://martinruiz91n:RidenCode17@krugerbackendap.chz4m.mongodb.net/products?retryWrites=true&w=majority"
    );
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.log("Error al conectar", error);
  }
};
