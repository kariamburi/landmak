"use server";
import { handleError } from '../utils';
import Transaction from '../database/models/transaction.model';

import { connectToDatabase } from '../database';
import { CreateTransactionParams, DeleteBookmarkParams, TransactionStatusParams } from '@/types';
import axios from 'axios';
import { NextResponse } from 'next/server';
import Packages from '../database/models/packages.model';
import User from '../database/models/user.model';
export async function transactionStatus(transaction: TransactionStatusParams) {

  const apiUrl = "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken";
  const consumerKey = "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW";
  const consumerSecret = "osGQ364R49cXKeOYSpaOnT++rHs=";

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  const data = {
    "consumer_key": consumerKey,
    "consumer_secret": consumerSecret
  };

  try {
    const response = await axios.post(apiUrl, data, { headers });

    const responseData = response.data;

    if (responseData && responseData.token) {
      const token = responseData.token;

      // Construct the request URL for the second API call
      const regueststatusurl = `https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus?orderTrackingId=${transaction.orderTrackingId}`;

      // Set headers for the second request
      const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      try {
        const response = await axios.get(regueststatusurl, { headers: requestHeaders });

        const responseData = response.data;
        //console.log(responseData);
        if (responseData && responseData.status === "200") {

          //console.log("amount: "+responseData.amount);

          const trans = {
            orderTrackingId: transaction.orderTrackingId,
            amount: transaction.amount,
            plan: transaction.plan,
            planId: transaction.planId,
            period: transaction.period,
            buyerId: transaction.buyerId,
            status: "Active",
            //phone: transaction.phone,
            //  firstName: transaction.firstName,
            //middleName: transaction.middleName,
            // lastName: transaction.lastName,
            //  email: transaction.email,
            merchantId: responseData.merchant_reference,
            createdAt: new Date(),
          };
          //  console.log(trans);
          const newTransaction = await createTransaction(trans);
          // console.log(JSON.stringify(newTransaction))
          // console.log(newTransaction);
          return "success";
        } else {
          // console.log(responseData.status);
          return "failed";
        }

      } catch (error) {
        console.error('Error:', error);
        return "error";
        // Handle error appropriately
      }
    } else {
      // throw new Error('Unable to extract token from response');
      return "error";
    }
  } catch (error) {
    console.error('Error:', error);
    return "error";
    // Handle error appropriately
  }

  //redirect(session.url!)
}
const populateAd = (query: any) => {
  return query
    .populate({ path: 'planId', model: Packages, select: '_id name list features price' })
    .populate({ path: 'buyer', model: User, select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified fcmToken' })
}
// GET ONE Ad BY ID
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { FreePackId } from '@/constants';
import DynamicAd from '../database/models/dynamicAd.model';

export async function getData(userId: string) {
  try {
    // Connect to the MongoDB server
    await connectToDatabase();

    // Find the most recent transaction for the user
    const status = "Active";
    const conditions = { $and: [{ buyer: userId }, { status: status }, { plan: { $ne: "Verification" } }] };
    const recentTransaction = await Transaction.find(conditions)
      .sort({ createdAt: 'desc' })
      .limit(1)
      .lean() // Convert Mongoose document to plain JS object
      .exec();

    if (!recentTransaction || recentTransaction.length === 0) {
      // No recent transactions found; use the free plan
      const planIdFree = FreePackId;
      const pack = await Packages.findById(planIdFree).lean();

      if (!pack) {
        console.error("Package not found for FreePackId:", planIdFree);
      }

      const adConditions = { organizer: userId };
      const AdCount = await DynamicAd.countDocuments(adConditions);

      console.log({
        transaction: null,
        ads: AdCount,
        currentpack: pack,
      });

      return {
        transaction: null,
        ads: AdCount,
        currentpack: pack,
      };
    } else {
      // Recent transaction found; use the transaction's plan
      const transaction = recentTransaction[0]; // Since find() returns an array
      const planId = transaction.planId ? new ObjectId(transaction.planId) : null;
      const pack = await Packages.findById(transaction.planId).lean();

      if (!pack) {
        console.error("Package not found for transaction planId:", transaction.planId);
      }

      const adConditions = {
        $and: [{ plan: planId }, { createdAt: { $gte: transaction.createdAt } }],
      };
      const AdCount = await DynamicAd.countDocuments(adConditions);

      console.log("Transaction:", transaction, "AdCount:", AdCount, "Pack:", pack);

      return {
        transaction,
        ads: AdCount,
        currentpack: pack,
      };
    }
  } catch (error) {
    console.error("Error in getData:", error);
    return { transaction: null, ads: 0, currentpack: null }; // Fallback return value
  }
}



export async function getpayTransaction(orderTrackingId: string) {
  try {
    // Connect to the MongoDB server
    await connectToDatabase();

    // Find the document by buyerId
    const conditions = { orderTrackingId: orderTrackingId }
    const trans = await populateAd(Transaction.find(conditions));

    if (!trans) throw new Error('Transaction not found');

    // Return the document
    return JSON.parse(JSON.stringify(trans));
  } catch (error) {
    // Handle any errors
    handleError(error);
  }
}
export async function getallTransaction(userId: string) {
  try {
    // Connect to the MongoDB server
    await connectToDatabase();

    // Find the document by buyerId
    const conditions = { buyer: userId }
    const trans = await populateAd(Transaction.find(conditions));

    if (!trans) throw new Error('Transaction not found');

    // Return the document
    return JSON.parse(JSON.stringify(trans));
  } catch (error) {
    // Handle any errors
    handleError(error);
  }
}
export async function getallTrans() {
  try {
    // Connect to the MongoDB server
    await connectToDatabase();

    // Find the document by buyerId
    const conditions = {}
    const trans = await populateAd(Transaction.find(conditions));

    if (!trans) throw new Error('Transaction not found');

    // Return the document
    return JSON.parse(JSON.stringify(trans));
  } catch (error) {
    // Handle any errors
    handleError(error);
  }
}
export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();
    // Check if orderTrackingId exists
    const existingTransaction = await Transaction.findOne({ orderTrackingId: transaction.orderTrackingId });

    if (existingTransaction) {
      throw new Error('Transaction with the same orderTrackingId already exists');
    }

    // Create a new transaction with a buyerId
    const newTransaction = await Transaction.create({
      ...transaction, buyer: transaction.buyerId
    })

    //console.log(JSON.parse(JSON.stringify(newTransaction)))
    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error)
  }
}

export async function getallTransactions(transationId: string, start: string, end: string, limit: number, page: number) {
  try {
    await connectToDatabase();

    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;

    // Build conditions dynamically
    const conditions: any = {};
    if (transationId) {
      conditions.orderTrackingId = { $regex: transationId, $options: 'i' };
    }
    if (startDate || endDate) {
      conditions.createdAt = {};
      if (startDate) {
        conditions.createdAt.$gte = startDate; // Greater than or equal to startDate
      }
      if (endDate) {
        conditions.createdAt.$lte = endDate; // Less than or equal to endDate
      }
    }

    const skipAmount = (Number(page) - 1) * limit;

    // Fetch filtered orders with pagination
    const trans = await populateAd(
      Transaction.find(conditions)
        .skip(skipAmount)
        .limit(limit)
    );

    // Get the count of documents that match the conditions
    const AdCount = await Transaction.countDocuments(conditions);
    return { data: JSON.parse(JSON.stringify(trans)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
// DELETE
export async function deleteTransaction({ _id, path }: DeleteBookmarkParams) {
  try {
    await connectToDatabase()

    const deletedOrder = await Transaction.findByIdAndDelete(_id)
    // Delete image from uploadthing
    if (deletedOrder) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}
export async function getGraphSales(duration: string) {
  try {
    await connectToDatabase();

    let groupByFormat;

    // Determine grouping format based on duration
    switch (duration) {
      case 'day':
        groupByFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        break;
      case 'week':
        groupByFormat = { $isoWeek: "$createdAt" }; // ISO week number
        break;
      case 'month':
        groupByFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        break;
      default:
        return { error: "Invalid duration" };
    }

    const salesData = await Transaction.aggregate([
      { $match: { status: { $in: ['successful'] } } },
      {
        $group: {
          _id: groupByFormat,
          totalSales: { $sum: "$amount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);
    return JSON.parse(JSON.stringify(salesData));
  } catch (error) {
    handleError(error)
  }
}
export async function getStatusTrans() {
  try {
    await connectToDatabase();

    const result = await Transaction.aggregate([
      {
        $group: {
          _id: "$status", // Group by status
          count: { $sum: 1 }, // Count the number of orders in each status
          totalWorth: { $sum: "$amount" }, // Sum up the worth of orders
        },
      },
    ]);
    // Transform the aggregation result into a more accessible format
    //console.log(result)
    return result;
    //const statusData = result.reduce((acc, { _id, count, totalWorth }) => {
    //  acc[_id] = { count, totalWorth };
    //   return acc;
    // }, {});
    //  console.log(statusData)
    // Return default values for statuses that might not exist in the result
    //  console.log({
    // pending: statusData.pending || { count: 0, totalWorth: 0},
    //  successful: statusData.successful || { count: 0, totalWorth: 0 },
    // })
    //return {
    //  pending: statusData.pending || { count: 0, totalWorth: 0},
    //  successful: statusData.successful || { count: 0, totalWorth: 0 },
    // };
  } catch (error) {
    console.error("Error fetching order statuses with worth and profit:", error);
    throw new Error("Unable to fetch order statuses with worth and profit");
  }
}
// Function to check expired subscriptions
export async function checkExpiredLatestSubscriptionsPerUser() {
  try {
    await connectToDatabase();

    const now = new Date();

    const subscriptions = await Transaction.aggregate([
      // Sort to get the latest transaction per buyer
      { $sort: { buyer: 1, createdAt: -1 } },
      {
        $group: {
          _id: '$buyer',
          latestTransaction: { $first: '$$ROOT' }
        }
      },
      {
        $addFields: {
          periodMs: {
            $switch: {
              branches: [
                { case: { $eq: ['$latestTransaction.period', '7 days'] }, then: 7 * 24 * 60 * 60 * 1000 },
                { case: { $eq: ['$latestTransaction.period', '14 days'] }, then: 14 * 24 * 60 * 60 * 1000 },
                { case: { $eq: ['$latestTransaction.period', '30 days'] }, then: 30 * 24 * 60 * 60 * 1000 }
              ],
              default: 0
            }
          }
        }
      },
      {
        $addFields: {
          expiryDate: { $add: ['$latestTransaction.createdAt', '$periodMs'] }
        }
      },
      {
        $addFields: {
          isExpired: { $lt: ['$expiryDate', now] }
        }
      },
      {
        $match: {
          'latestTransaction.plan': { $ne: 'Verification' }
        }
      },

      // Lookup planId details from Packages
      {
        $lookup: {
          from: 'packages',
          localField: 'latestTransaction.planId',
          foreignField: '_id',
          as: 'planDetails'
        }
      },
      { $unwind: { path: '$planDetails', preserveNullAndEmptyArrays: true } },

      // Lookup buyer details from Users
      {
        $lookup: {
          from: 'users',
          localField: 'latestTransaction.buyer',
          foreignField: '_id',
          as: 'buyerDetails'
        }
      },
      { $unwind: { path: '$buyerDetails', preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 0,
          buyer: '$_id',
          latestTransaction: 1,
          expiryDate: 1,
          isExpired: 1,
          planDetails: {
            _id: 1,
            name: 1,
            list: 1,
            features: 1,
            price: 1
          },
          buyerDetails: {
            _id: 1,
            clerkId: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
            photo: 1,
            businessname: 1,
            aboutbusiness: 1,
            businessaddress: 1,
            latitude: 1,
            longitude: 1,
            businesshours: 1,
            businessworkingdays: 1,
            phone: 1,
            whatsapp: 1,
            website: 1,
            facebook: 1,
            twitter: 1,
            instagram: 1,
            tiktok: 1,
            imageUrl: 1,
            verified: 1,
            token: 1
          }
        }
      }
    ]);

    return JSON.parse(JSON.stringify(subscriptions));
  } catch (error) {
    console.error('Error checking subscriptions:', error);
    handleError(error);
    throw error;
  }
}
