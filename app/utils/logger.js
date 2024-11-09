import winston from "winston";
import "winston-daily-rotate-file";

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  //template string
  //vamosa a reemplazar {"level":"error":"messsage:"esto es un error"}
  //por esto "24/5/2024"
  return `${timestamp} ${level.toUpperCase()}: ${message}`;
});

const customLevelsOptions = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
  },
};

const fileTransport = new winston.transports.DailyRotateFile({
  dirname: "./logs",
  filename: "application-%DATE%.log", //application-24-5-2024.log (solo se van a registrar los eventos que le pertenecen al 25 de octubre , y asi susecivamente dependiendo del dia.)
  datePattern: "DD-MM-YYYY-MM-HH-mm",
  //vamos a definir una politica de retencion de archivos
  //primero lo mas importante es que van a crecer y la idea es optimizar espacio en el disco (lo vamos a zippear)
  //vamos a comprimir los archivos que ya no se esten usando
  zippedArchive: true,
  //vamos a definir el tamaño maximo de nuestros archivos
  maxSize: "1m",
  //vamos a definir el numero maximo de archivos que vamos a tener disponibles, una vez lleguems a ese numero, los archivo mas antiguos se vana aeliminar
  maxFiles: 3,
  //vamos a definir la frecuencia en tiempo que queremos segmenta nuestros logs (se recomiendan segmentarlos por dia)
  //para practicar vamos a generar un archivo de logs por mimutos
  frequency: "1m",
  level: "debug",
});

//vamos a crear nuestro logger
//para esto teneos que definir un trasnsporte

const logger = winston.createLogger({
  levels: customLevelsOptions.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({
          all: true,
          colors: customLevelsOptions.colors,
        })
      ),
    }),
    //vamos a agregar un nuevo trasporte que envia a un archivo
    fileTransport,
  ],
});

//como registrar los eventos en consola (yo decido el nivel que debe registrar)
//logger.error("hola mundo esto es un eror")
//logger.warn("hola mundo esto es un warn")
//logger.info("hola mundo con logger")
//logger.http("hola mundo esto es un http")
//logger.verbose("hola mundo esto es un verbose")
//logger.debug("hola mundo esto es un debug")
//logger.silly("hola mundo esto es un silly")

export default logger;
