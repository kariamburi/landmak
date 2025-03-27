import { connectToDatabase } from './inex.js';
import cron from 'node-cron';
import { DateTime } from 'luxon';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import webpush from 'web-push';
const usersOnline = new Map(); // Store online users in memory

// Configure Web Push Notifications
webpush.setVapidDetails(
  'mailto:support@landmark.co.ke',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BKaY45_ET0wP-5svvi6Nm9emh7Ubhz2l1tToqa9dxwaNpFxIQ0oZmr9Dz3LqAmKCFehDXb7NfyYkAZKRtmN7-XU",
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY || "rTxv6alyd0gtQELN9wKoBC6OICIo-1A48pFC-Zgi9F0"
);


// Initialize Express App
const app = express();
// Allow requests from frontend
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:3000", "https://landmark.co.ke"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Create HTTP Server and Attach Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Change to your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Define Mongoose Schemas
const subscriptionSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true },
  plan: { type: String, required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, required: true },
  period: { type: String, required: true },
  status: { type: String, default: 'Active' },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrls: [String],
  negotiable: Boolean,
  latitude: String,
  longitude: String,
  address: String,
  phone: String,
  subcategory: String,
  price: Number,
  make: String,
  vehiclemodel: String,
  vehicleyear: String,
  vehiclecolor: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, required: true },
  priority: { type: Number, default: 1 },
  status: String,
  createdAt: { type: Date, default: Date.now },
});

const Ad = mongoose.model('DynamicAd', adSchema);

const BusinesshoursSchema = new mongoose.Schema({
  openHour: { type: String, required: true },
  openMinute: { type: String, required: true },
  closeHour: { type: String, required: true },
  closeMinute: { type: String, required: true },
});

const VerifiedSchema = new mongoose.Schema({
  accountverified: { type: Boolean, required: true },
  verifieddate: { type: Date, required: true },
});

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  photo: { type: String, required: true },
  status: { type: String, required: true },
  businessname: { type: String }, // Optional
  aboutbusiness: { type: String }, // Optional
  businessaddress: { type: String }, // Optional
  latitude: { type: String }, // Optional
  longitude: { type: String }, // Optional
  businesshours: { type: [BusinesshoursSchema], default: [] }, // Optional
  businessworkingdays: { type: [String], default: [] }, // Optional
  phone: { type: String }, // Optional
  whatsapp: { type: String }, // Optional
  website: { type: String }, // Optional
  facebook: { type: String }, // Optional
  twitter: { type: String }, // Optional
  instagram: { type: String }, // Optional
  tiktok: { type: String }, // Optional
  verified: { type: [VerifiedSchema], required: true }, // Optional
  imageUrl: { type: String }, // Optional
  pushId: { type: String },
  isOnline: { type: Boolean, default: false },
  lastActive: { type: Date, default: null },
});
//delete mongoose.models.User;
const User = mongoose.model('User', UserSchema);

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  endpoint: { type: String, required: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true }
  }
}, { timestamps: true });

const Notification = mongoose.model('Notification', NotificationSchema);

function calculateExpiration(createdAt, period) {
  const [value, unit] = period.split(' ');
  return DateTime.fromJSDate(createdAt).plus({ [unit]: parseInt(value) }).toJSDate();
}

// Function to Check Expired Subscriptions
async function checkExpiredSubscriptions() {
  const now = new Date();

  try {
    await connectToDatabase();

    const subscriptions = await Subscription.find({
      status: 'Active',
      plan: { $ne: 'Verification' }
    });

    subscriptions.forEach(async (subscription) => {
      const expirationDate = calculateExpiration(subscription.createdAt, subscription.period);

      if (expirationDate <= now) {
        subscription.status = 'Expired';
        await subscription.save();

        console.log(`Subscription expired: Buyer: ${subscription.buyer}, Plan ID: ${subscription.planId}`);

        await Ad.updateMany(
          { organizer: subscription.buyer },
          { priority: 1, plan: '677a7b97d24cd2414b1260b7' }
        );

        console.log(`Updated ads for buyer: ${subscription.buyer}`);

        // **Send Web Push Notification**
        const notification = await Notification.findOne({ user: subscription.buyer });

        if (notification) {
          const payload = JSON.stringify({
            title: 'Subscription Expired',
            body: 'Your subscription has expired. Please renew to continue.',
          });

          try {
            await webpush.sendNotification(notification, payload);
            console.log(`Push notification sent to ${subscription.buyer}`);
          } catch (err) {
            console.error('Push notification error:', err);
          }
        }

        io.emit('subscriptionExpired', {
          buyerId: subscription.buyer,
          message: 'Your subscription has expired. Please renew to continue.'
        });
      }
    });
  } catch (err) {
    console.error('Error checking subscriptions:', err);
  }
}


// Schedule Task to Run Every 12 Hours
cron.schedule('0 */12 * * *', async () => {
  console.log('Running subscription expiration check...');
  await checkExpiredSubscriptions();
});

app.post('/subscribe', async (req, res) => {
  const { userId, subscription } = req.body;

  if (!userId || !subscription) {
    return res.status(400).json({ error: 'User ID and subscription are required' });
  }

  try {
    await connectToDatabase();

    // Check if the subscription already exists
    const existingSubscription = await Notification.findOne({ user: userId });
    console.log("existingSubscription:" + existingSubscription)
    if (existingSubscription) {
      // If the subscription endpoint is different, update it
      if (existingSubscription.endpoint !== subscription.endpoint) {
        await Notification.findOneAndUpdate(
          { user: userId },
          { endpoint: subscription.endpoint, keys: subscription.keys },
          { new: true }
        );
        console.log("Exist Subscribed successfully")
      }
    } else {
      // Store new subscription
      console.log("Create Subscription:")
      await Notification.create({
        user: userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      });
    }
    console.log("New Subscribed successfully")
    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Handle WebSocket Connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  //socket.on("user-online", async (userId) => {
  // await connectToDatabase();
  //  await User.findByIdAndUpdate(userId, { isOnline: true, lastActive: new Date() });
  //  io.emit("update-status", { userId, isOnline: true });
  // console.log('user-online:', userId);
  //  });
  socket.on("user-online", async (userId) => {
    usersOnline.set(userId, socket.id);
    io.emit("update-status", { userId, isOnline: true });

    // Update DB but avoid excessive writes

    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { isOnline: true, lastActive: new Date() }, { new: true });
    console.log(`User ${userId} is online.`);
  });
  socket.on("user-offline", async (userId) => {
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { isOnline: false, lastActive: new Date() });
    io.emit("update-status", { userId, isOnline: false });
    console.log('user-offline:', userId);
  });



  socket.on("newMessage", async (data) => {
    // Notify the recipient via Web Push API

    await connectToDatabase();
    const notification = await Notification.findOne({ user: data.userId });
    if (notification) {
      const payload = JSON.stringify({
        title: "New Message",
        body: `${data.senderName}: ${data.message}`,
        data: {
          url: `${data.callbackUrl}` // Replace with the actual chat page URL
        }
      });

      try {
        await webpush.sendNotification(notification, payload);
        console.log(`Push notification sent to ${data.userId}`);
      } catch (err) {
        console.error('Push notification error:', err);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    const userId = [...usersOnline.entries()].find(([id, sid]) => sid === socket.id)?.[0];

    if (userId) {
      usersOnline.delete(userId);

      // Delay marking offline to prevent frequent status flickers
      setTimeout(async () => {
        if (![...usersOnline.keys()].includes(userId)) {
          await connectToDatabase();
          await User.findByIdAndUpdate(userId, { isOnline: false, lastActive: new Date() });
          io.emit("update-status", { userId, isOnline: false });
          console.log(`User ${userId} went offline.`);
        }
      }, 5000); // 5-second grace period
    }
  });
});

// Start HTTP Server
const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Close MongoDB Connection on Exit
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
