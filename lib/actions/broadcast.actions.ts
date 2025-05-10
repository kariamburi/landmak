"use server"

import { CreateBookmarkParams, CreatePackagesParams, DeleteBookmarkParams, DeleteCategoryParams, DeletePackagesParams, UpdatePackagesParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"

import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"

import Bookmark from "../database/models/bookmark.model"
//import Product from "../database/models/product.model"
//import Subscriber from "../database/models/NotifySchema"
import User from "../database/models/user.model"
import nodemailer from 'nodemailer';
import axios from "axios"
import SendChat from "@/components/shared/SendChat"

export async function broadcastMessage(type: string, message: string, recipient?: any) {
  try {
    // Connect to the database
    if (recipient) {
      // Send to one user
      if (type === "email") {
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
          from: '"mapa" <support@mapa.co.ke>',
          to: recipient.email,
          subject: `Important Notification`,
          html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px; color: #333;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <span style="display: inline-flex; align-items: center; gap: 8px;">
    <img src="https://mapa.co.ke/logo.png" alt="mapa Logo" style="height: 30px; gap:5px; width: auto;" />
    <span style="font-size: 20px; font-weight: bold; color: #16A34A;">mapa</span>
  </span>
                </div>
        
                <h2 style="color: #16A34A;">Important Notification</h2>
                <p>Hello,</p>
                <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-left: 4px solid #16A34A; border-radius: 5px;">
                  <p style="margin: 0;">"${message}"</p>
                </div>
        
                <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="font-size: 12px; color: #999;">This email was sent by mapa (<a href="https://mapa.co.ke" style="color: #999;">mapa.co.ke</a>).</p>
              </div>
            `,
        };

        try {
          const response = await transporter.sendMail(mailOptions);

          return { message: `${type === 'email' ? 'Emails' : 'Notifications'} sent successfully to all recipients.` };
        } catch (error) {
          console.error('Error sending email:', error);
          return "Failed";
        }

      } else {
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_DOMAIN_URL + "/api/send-push", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: recipient.token,
              notification: {
                title: "Important Notification",
                body: message,
                icon: "https://mapa.co.ke/logo.png",
                click_action: `https://mapa.co.ke/?action=chat`,
              },
            }),
          });

          const data = await res.json();

          return { message: `${type === 'email' ? 'Emails' : 'Notifications'} sent successfully to all recipients.` };
        } catch (error) {
          console.error('Error sending notification:', error);
          return "Failed";
        }
      }
    } else {
      await connectToDatabase();

      // Fetch users' emails or phone numbers
      const userContacts = await User.find({}, type === 'email' ? 'email' : 'token')
        .then((users) => users.map((u) => (type === 'email' ? u.email : u.token)).filter(Boolean));
      console.log(userContacts)
      // Fetch subscribers based on type (email or phone)
      // const subscribers = await Subscriber.find({
      //   contact: type === 'email' ? { $regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } : { $regex: /^\+?[0-9]{7,}$/ },
      // }).then((subs) => subs.map((s) => s.contact));

      // Deduplicate recipients
      const subscribers: any = [];
      const recipients = Array.from(new Set([...userContacts, ...subscribers]));

      if (recipients.length === 0) {
        return { message: `No ${type} recipients found.` };
      }

      // Handle email sending
      if (type === 'email') {

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 587,
          secure: false, // Use TLS
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const emailPromises = recipients.map((email) => {
          const mailOptions = {
            from: '"mapa" <support@mapa.co.ke>',
            to: email,
            subject: `Important Notification`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px; color: #333;">
              <div style="text-align: center; margin-bottom: 30px;">
                 <span style="display: inline-flex; align-items: center; gap: 8px;">
    <img src="https://mapa.co.ke/logo.png" alt="mapa Logo" style="height: 30px; gap:5px; width: auto;" />
    <span style="font-size: 20px; font-weight: bold; color: #16A34A;">mapa</span>
  </span>
              </div>
      
              <h2 style="color: #16A34A;">Important Notification</h2>
              <p>Hello,</p>
              <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-left: 4px solid #16A34A; border-radius: 5px;">
                <p style="margin: 0;">"${message}"</p>
              </div>
      
              <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />
              <p style="font-size: 12px; color: #999;">This email was sent by mapa (<a href="https://mapa.co.ke" style="color: #999;">mapa.co.ke</a>).</p>
            </div>
          `,
          };

          return transporter.sendMail(mailOptions)
            .then((res) => {
              console.log(`Email sent to ${email}`);
              return res;
            })
            .catch((err) => {
              console.error(`Error sending to ${email}:`, err);
              return { error: err };
            });
        });

        const results = await Promise.all(emailPromises);

      }

      // Handle SMS sending
      if (type === 'sms') {
        const notifications = recipients.map((token) =>
          fetch("/api/send-push", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              notification: {
                title: "New Message",
                body: message,
                icon: "https://mapa.co.ke/logo.png",
                click_action: `https://mapa.co.ke/?action=chat`,
              },
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Push Response:", data);
              return data;
            })
            .catch((err) => {
              console.error("Push Error:", err);
              return { error: err };
            })
        );

        // Await all at once
        const results = await Promise.all(notifications);

      }

      return { message: `${type === 'email' ? 'Emails' : 'Notifications'} sent successfully to all recipients.` };
    }
  } catch (error) {
    console.error('Error in broadcastMessage:', error);
    throw new Error('Failed to send messages.');
  }

}

