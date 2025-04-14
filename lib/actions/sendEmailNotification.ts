"use server";
import nodemailer from 'nodemailer';

export async function sendEmailNotification(
  recipientEmail: string,
  message: string,
) {

  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Your SMTP host
    port: 587, // Use 587 for TLS
    secure: false, // True if using port 465
    auth: {
      user: process.env.SMTP_USER, // Your SMTP user
      pass: process.env.SMTP_PASS, // Your SMTP password
    }
  });


  const mailOptions = {
    from: '"PocketShop" <support@pocketshop.co.ke>',
    to: recipientEmail,
    subject: `Important Notification`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="display: inline-flex; align-items: center; gap: 8px;">
            <img src="https://pocketshop.co.ke/logo_green.png" alt="pocketshop Logo" style="height: 30px; width: auto;" />
            <span style="font-size: 18px; font-weight: bold; color: #064E3B;">PocketShop</span>
          </span>
        </div>

        <h2 style="color: #064E3B;">Important Notification</h2>
        <p>Hello,</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-left: 4px solid #064E3B; border-radius: 5px;">
          <p style="margin: 0;">"${message}"</p>
        </div>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #999;">This email was sent by PocketShop (<a href="https://pocketshop.co.ke" style="color: #999;">pocketshop.co.ke</a>).</p>
      </div>
    `,
  };


  try {
    const response = await transporter.sendMail(mailOptions);
    console.log('Email sent:', response);
    return "success";
  } catch (error) {
    console.error('Error sending email:', error);
    return "Failed";
  }
}
