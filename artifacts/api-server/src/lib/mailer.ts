import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}) {
  if (!process.env.SMTP_USER) return;

  await transporter.sendMail({
    from: `"Azhar Engineering Website" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL || "azharkhaki2005@gmail.com",
    replyTo: data.email,
    subject: `[Website Contact] ${data.subject || "New Message from " + data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c8922a;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject || "N/A"}</p>
        <hr style="border-color: #252e3e;" />
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      </div>
    `,
  });
}
