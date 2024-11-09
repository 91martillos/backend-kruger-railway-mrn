import { now } from "mongoose";
import { User } from "../models/user.model.js";
import sendEmail from "../utils/email.js";

const saveUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getUser = async (req, res) => {
  try {
    //vamos a buscar todos los usuarios y que retorne unicamente los que tengan null en el campo deltedAt

    const users = await User.find({ deletedAt: null });
    res.json(users);
  } catch (error) {
    res.json(error);
  }
};

//vamos a crear una funcion para delete un usuario, cada que borremos un usuario vamos a actualizar el campo deletedAt
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      deletedAt: Date.now(),
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No hay el usuario que buscas panita" });
    }
    res.json({ message: "Eliminao" });
  } catch (error) {
    res.status(500).send(error);
  }
};

//vamos a crear una funcion para enviar un correo
const sendWelcomeEmail = async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    await sendEmail({ email, subject, message });
    res.json({ message: "Email enviado" });
  } catch (error) {
    res.status(400).send(error);
  }
};

export { saveUser, getUser, sendWelcomeEmail, deleteUser };
