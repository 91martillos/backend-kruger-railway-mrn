import { config } from "dotenv";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import configs from "../configs/configs.js";
import sendEmail from "../utils/email.js";
import crypto from "crypto";

const register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const login = async (req, res) => {
  try {
    //1. vamos a obtener las credenciales (username, password) del request
    const { username, password } = req.body;
    //2. vamos a buscar el user en la basa de dtos, si no existe vamos a retornar un 404
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No hay el usuario que buscas bro" });
    }
    //3. vamos a comparar el password de la base de datos con el password que nos envia el user
    const passwordsMatch = await user.comparePassword(password);
    //4. Si el password no coincide vamos a retornar un 401
    if (!passwordsMatch) {
      return res.status(401).json({ message: "Contraseña ERRONEADA bro" });
    }
    //5. Si todo sale bien vamos a generar un token JWT y vamos a retornar un 200 con la repsuesta
    //El metodo sign lo que hace es firmar nuestro jwt (token) la firma del token sirve para poder validar
    //que el token no haya sido modificado por un trcero
    //el primer pramentro que vamosa a enviar en el metodo es un objeto que contiene la infromación del usuario

    const token = await jwt.sign(
      {
        user_id: user._id,
        role: user.role,
      },
      configs.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //vamosa  buscar si el correo que esta enviando existe o esta alacenado el na bdd
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No hay el usuario que buscas panita" });
    }

    //vamos a generar un token unico que vamosa a enviar al correo del usuario
    const resetToken = user.generatePasswordToken();
    await user.save({ validateBeforeSave: false });

    //vamos a generar la url que vamosa a enviar al correo del usuario
    //http://localhost:5173/reset-password/resetTokenPAssword (esta ruta es donde va a estar levantado el frontend)

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    //vamos a enviar el correo
    try {
      const message = `Dale click AQUI para reestablecer su contraseña: ${resetUrl}`;

      await sendEmail({
        email: user.email,
        subject: "Reestablecer contraseña",
        message,
      });
      res.status(200).json({ message: "Email enviado" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//vamos a crear un controlador para reestablecer la contraseña
const resetPassword = async (req, res) => {
  try {
    //1.-Vamos a obtener el toker de request
    const { token } = req.params;
    //2.- Vamos a obtener el nuevo password que ha configurado el sistema!
    const { password } = req.body;
    //3.- En BDD tenemos el token pero esta hashado y lo qu llega en el reuqes es de texto palno
    //vamos a hashear el token que llega en el request para poder hasarlo con el token hashado en la base de datos
    const resetPAsswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    //4.- vamos a buscar ese user de acuerdo al token hashado, y ademas vamos aplicar la condicion de tiempo de vida del token
    const user = await User.findOne({
      resetPasswordToken: resetPAsswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    //5.- vamos a validar si el user que estamos buscando existe o no
    if (!user) {
      return res.status(404).json({ message: "expiro el token o no vale" });
    }

    //6.- vamos a reescribir el password del user
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    //7.- vamos a retornar un 200
    res.status(200).json({ message: "Contraseña reestablecida" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { register, login, forgotPassword, resetPassword };
