import logger from "../utils/logger.js";

const testLogs = async (req, res) => {
  try {
    //logger.error("hola mundo con error");
    //logger.info("hola mundo con info");
    //logger.warn("hola mundo con warn");
    //logger.http("hola mundo con http");
    //logger.verbose("hola mundo con verbose");
    //logger.debug("hola mundo con debug");
    //logger.silly("hola mundo con silly");
    logger.error("esto es un error");
    logger.warn("esto es un warn");
    logger.info("esto es un info");
    logger.debug("esto es un debug");
    res.json("ok el test del log");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { testLogs };
