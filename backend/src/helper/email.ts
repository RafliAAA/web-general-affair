import { transporter } from "../config/nodemailer";

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: SendEmailParams) => {
  try {
    await transporter.sendMail({
      from: `"Sistem Manajemen Aset" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text,
    });
    console.log(`✅ Email terkirim ke: ${to}`);
  } catch (error) {
    console.error(" Gagal mengirim email:", error);
  }
};
