import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { to, subject, body } = req.body;

  try {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, // Your SMTP host
        port: 587, // Use 587 for TLS
        secure: false, // True if using port 465
        auth: {
          user: process.env.SMTP_USER, // Your SMTP user
          pass: process.env.SMTP_PASS, // Your SMTP password
        },
    });

    await transporter.sendMail({
      from: `"mapa" <support@mapa.co.ke>`,
      to,
      subject,
      html: body,
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Failed to send receipt:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
