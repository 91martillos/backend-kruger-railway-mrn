import nodemailer from "nodemailer";
import configs from "../configs/configs.js";

//En las opciones vamos a  recibir el email done vamos a a enviar el correo
//vamos  recibir el asunto del correo
//vamos a recibir el mensaje del correo
//Options es un obejeto que tiene las propiedaddes del email, subjet message
//
const sendEmail = async (options) => {
  //vamos a crear la integracion con el servicio de mailtrap usando nodemailer
  const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 2525,
    auth: { user: configs.MAILTRAP_USER, pass: configs.MAILTRAP_PASS },
  });

  console.log(options);

  //vamos a armar las opciones de envio de nuestro correo
  const mailOptions = {
    from: `"El Patron Mejia" <no-reply@demomailtrap.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //vamos a enviar el correo
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
