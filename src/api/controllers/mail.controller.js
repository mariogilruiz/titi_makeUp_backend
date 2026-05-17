const nodemailer = require("nodemailer");

require("dotenv").config();
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;

function validatePayload(payload = {}) {
  const { name, email, message, phone } = payload;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return "El nombre es obligatorio";
  }

  if (!email || typeof email !== "string") {
    return "El correo es obligatorio";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "El correo no es valido";
  }

  if (!message || typeof message !== "string" || message.trim().length < 10) {
    return "El mensaje debe tener al menos 10 caracteres";
  }

  if (name.trim().length > 120) {
    return "El nombre es demasiado largo";
  }

  if (message.trim().length > 3000) {
    return "El mensaje es demasiado largo";
  }

  if (phone && typeof phone !== "string") {
    return "El telefono no es valido";
  }

  return null;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildTransport() {
  return nodemailer.createTransport(SMTP_CONFIG);
}

// Enviar confirmación al cliente
async function sendEmailToClient(data) {
  const { name, email } = data;
  const safeName = escapeHtml(name.trim());

  const mailOptions = {
    from: CONTACT_FROM_EMAIL,
    to: email,
    subject: "Confirmación de tu mensaje - Titi MakeUp",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #fff; padding: 30px; border-radius: 8px;">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Hola ${safeName}</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">Muchas gracias por tu mensaje.</p>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">Agradezco que te hayas tomado el tiempo de escribir. Procuro dar respuesta en no más de las próximas 24 horas.</p>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">Un saludo,</p>
          <p style="color: #555; font-size: 16px; line-height: 1.6;"><strong>Nuria Jiménez MakeUp</strong></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">Este es un correo automático, no es necesario responder.</p>
        </div>
      </div>
    `,
  };

  const transporter = buildTransport();
  await transporter.sendMail(mailOptions);
  // Si falla, el error se propaga
}

// Enviar notificación al propietario
async function sendEmailToOwner(data) {
  const { name, email, message, phone } = data;
  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safePhone = escapeHtml((phone || "").trim());
  const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br/>");

  const mailOptions = {
    from: CONTACT_FROM_EMAIL,
    to: CONTACT_TO_EMAIL,
    subject: `Nuevo mensaje de contacto - ${safeName}`,
    replyTo: email,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #fff; padding: 30px; border-radius: 8px;">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Nuevo mensaje desde tu web</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 10px 0; color: #555;"><strong>Nombre:</strong> ${safeName}</p>
            <p style="margin: 10px 0; color: #555;"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 10px 0; color: #555;"><strong>Teléfono:</strong> ${safePhone || "No informado"}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
            <p style="margin: 10px 0; color: #555;"><strong>Mensaje:</strong></p>
            <p style="color: #555; line-height: 1.6;">${safeMessage}</p>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">Responde directamente a ${safeEmail}</p>
        </div>
      </div>
    `,
  };

  const transporter = buildTransport();
  await transporter.sendMail(mailOptions);
  // Si falla, el error se propaga
}

async function sendContactEmail(req, res) {
  const validationError = validatePayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const data = {
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      message: req.body.message.trim(),
      phone: (req.body.phone || "").trim(),
    };

    // Enviar ambos correos en paralelo y si falla alguno, lanzar error
    await Promise.all([sendEmailToClient(data), sendEmailToOwner(data)]);
    return res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("Error en sendContactEmail:", error);
    return res.status(500).json({ message: "No se pudo enviar el mensaje" });
  }
}

module.exports = {
  sendContactEmail,
};
