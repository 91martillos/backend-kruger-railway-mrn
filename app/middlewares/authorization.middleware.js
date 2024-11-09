//Vamos a recibir como parametro los roles que  pueden aceder a un servicio

const authorizationMiddleware = (roles) => {
  return (req, res, next) => {
    //debemos obtener el role del usuario que esta haciendo el request

    const userRole = req.user.role;
    console.log(userRole);

    //vamos a verificar si el role del usuario que esta hacieno el request tiene permitido acceder al servicio

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "No tienes permiso para acceder a este servicio ",
      });
    }
    next();
  };
};

export default authorizationMiddleware;
