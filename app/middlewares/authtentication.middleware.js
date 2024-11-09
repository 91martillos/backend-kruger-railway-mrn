import jwt from "jsonwebtoken";
import configs from "../configs/configs.js";

const authtenticationMiddleware = (req, res, next) => {
  //vamos s obtener el jwt del headerdel request
  const authHeader = req.header("authorization");

  //vamos a validar si esta llegando el jwt en el headery adicionalmente que el header siempre empiece por con la palabra bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No tienes token bro" });
  }
  //vamos a validar el jwt
  try {
    const token = authHeader.split(" ")[1]; //["Bearer", "tewterw....."

    console.log(token);
    //vamos a validarlo y a decodificarlo
    const decoded = jwt.verify(token, configs.JWT_SECRET);
    console.log(decoded);

    //vamos a agregar un atributo a nestro objeto request
    req.user = decoded;

    next();
  } catch (Error) {
    return res.status(401).json({ message: "Token invalido bro" });
  }
};

export default authtenticationMiddleware;
