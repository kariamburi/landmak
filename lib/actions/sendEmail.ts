"use server";
import nodemailer from 'nodemailer';

export async function sendEmail(
  recipientEmail: string,
  message: string,
  adTitle: string,
  adUrl: string,
  userName: string,
  userImage: string
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

  let mailOptionss = {
    from: '"mapa" <no-reply@mapa.co.ke>',
    to: recipientEmail,
    subject: "New Inquiry on Your Ad",
    text: `You have a new inquiry on your ad titled "${adTitle}". \n\nMessage: ${message}\n\nFrom: ${userName}\n\Kindly replay on mapa\n\n`,
    html: `<p>You have a new inquiry on your ad titled "<b>${adTitle}</b>".</p><p>Message: ${message}</p><p>From: ${userName}</p><p><b>Kindly replay on mapa</b></p></p>`,
  };
  const mailOptions = {
    from: '"mapa" <no-reply@mapa.co.ke>',
    to: recipientEmail,
    subject: `New Inquiry on Your Ad: ${adTitle}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px; color: #333;">
     <div style="text-align: center; margin-bottom: 30px;">
  <span style="display: inline-flex; align-items: center; gap: 8px;">
    <img src="https://mapa.co.ke/logo.png" alt="mapa Logo" style="height: 28px; width: auto;" />
    <span style="font-size: 24px; font-weight: bold; color: #16A34A;">mapa</span>
  </span>
</div>
    
    <h2 style="color: #16A34A;">You've Received a New Inquiry</h2>

      <p>Hello,</p>

      <p>You have a new message regarding your listing:</p>
      <h3 style="color: #444;">${adTitle}</h3>

      <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-left: 4px solid #16A34A; border-radius: 5px;">
        <p style="margin: 0;">"${message}"</p>
      </div>

      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="${userImage}" alt="${userName}" style="width: 48px; height: 48px; border-radius: 50%; margin-right: 10px;" />
        <div>
          <p style="margin: 0; font-weight: bold;">${userName}</p>
          <p style="margin: 0; color: #666;">Interested Buyer</p>
        </div>
      </div>

      <a href="${adUrl}" style="display: inline-block; padding: 12px 24px; background-color: #16A34A; color: white; text-decoration: none; border-radius: 5px;">
        View Ad on mapa
      </a>

      <p style="margin-top: 30px;">Please respond to this inquiry by logging into your mapa account.</p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 12px; color: #999;">This email was sent by mapa (<a href="https://mapa.co.ke" style="color: #999;">mapa.co.ke</a>).</p>
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
