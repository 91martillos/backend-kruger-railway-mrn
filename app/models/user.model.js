import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Ponga el nombrefff"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cratedAt: {
    type: Date,
    default: Date.now,
  },

  role: {
    type: String,
    enum: ["user", "admin", "author"], //lista de atributos que yo defino para cerrar un alcance
    default: "user", //establecemos un valor por dfault "cada vez que no nos llegue ese campo steamos un usuario normal"
  },

  resetPasswordToken: String, //para poder generar in identificador unico que vamos a enviar al usuario al correo
  resetPasswordExpire: Date, //para poder definir la fecha
  deletedAt: {
    type: Date, //Borrado Lógico: este es el borrado mas común, el que mas se deberia usar
    default: null,
  },
});

//vamos a aplicar un prehook (es un proceso que se va a ejectuar antes de almacenar el usuario en BDD
//el primer parametro de nuetro prehook es la operacion ala cual vamos a aplicar el hook
userSchema.pre("save", async function (next) {
  const user = this; //this es el objeto ue estamosa guardando en BDD

  //solo si se esta modificando el atributo password vamosa apreoceder a hashear la contrasena
  if (user.isModified("password")) {
    try {
      //primer paso para hashear la contrasena es generar un salt (es como una clave pero va a ser generado de manera randomica)
      const salt = await bcrypt.genSalt(10);
      //segundo paso es crear el hash
      //Digamos que el usuario pone 1234 de contraseña ahora se pasa a -> $%&GRGBWRGVEFABV
      const hash = await bcrypt.hash(user.password, salt);
      //tercer paso es reemplazar el valor de la contrasena
      user.password = hash;
      //cuarto paso es mandar el siguiente proceso (al flujo normal de ejecucion)
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

//vamos a crear ahora un hook que se encarge de eliminar la contraseña del objeto que se va a devolver al cliente.
userSchema.post("find", function (doc, next) {
  doc.forEach((doc) => {
    doc.password = undefined;
  });
  next();
});

//vamos a extender la funcionalidad de nuestro schema de manera que nos permita
//comparar la contraseña que el user esta enviando con la que tenemos en la base de datos
//recibe como parametro el password que envia el user para autenticarse
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generatePasswordToken = function () {
  //generamos la cadena randomica en formato hexadecimal
  const resetToken = crypto.randomBytes(20).toString("hex");
  //vamos a guardar generamos el token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //vamosa  definir el tiempo de expiraciond e nuestro token y a definirlo en 1 hor
  this.resetPasswordExpire = Date.now() + 36000000;
  return resetToken;
};

export const User = mongoose.model("user", userSchema);
