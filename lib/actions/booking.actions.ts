"use server"

import { CreateBookingParams, CreateReportedParams, CreateSitevisitParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import { revalidatePath } from "next/cache"
import Ad from "../database/models/ad.model"
import User from "../database/models/user.model"
import Reported from "../database/models/reported.model"
import DynamicAd from "../database/models/dynamicAd.model"
import Sitevisit from "../database/models/sitevisit.model"
import Booking from "../database/models/booking.model"


const populateAd = (query: any) => {
  return query
    .populate({ path: 'userId', model: User, select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified' })
    .populate({
      path: 'propertyId',
      model: DynamicAd,
      select: '_id data views priority expirely adstatus inquiries whatsapp calls shared bookmarked abused subcategory organizer plan createdAt', populate: {
        path: 'organizer',
        model: User, // or whatever model the organizer refers to
        select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified token notifications',
      },
    });
};
const populate = (query: any) => {
  return query
    .populate({
      path: 'propertyId',
      model: DynamicAd,
      select: '_id data views priority expirely adstatus inquiries whatsapp calls shared bookmarked abused subcategory organizer plan createdAt', populate: {
        path: 'organizer',
        model: User, // or whatever model the organizer refers to
        select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified token notifications',
      },
    });
};


export const createBooking = async ({ booking, path }: CreateBookingParams) => {
  try {
    await connectToDatabase();
    //  const conditions = { adId: bookmark.adId };
    const conditions = { $and: [{ propertyId: booking.propertyId }, { userId: booking.userId }] };
    const bookingresponse = await Booking.findOne(conditions);  // Use findOne to find a single matching document

    let newresponse = {}
    let response = "Booking request exist!"
    if (!bookingresponse) {
      newresponse = await Booking.create({ ...booking });
      response = "Booking requested"
    }

    revalidatePath(path)
    return response;
  } catch (error) {
    handleError(error)
  }
}
export const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'rejected') => {
  try {
    await connectToDatabase()
    const response = await Booking.findByIdAndUpdate(bookingId, { status });
    return { success: true };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false };
  }
};
export async function getBookingByOwnerId(_id: string) {
  try {
    await connectToDatabase()



    // Step 1: Find all properties posted by this owner
    const properties = await DynamicAd.find({ organizer: _id });
    const propertyIds = properties.map((p) => p._id);

    // Step 2: Find all bookings that match these property IDs
    const bookings = await populateAd(Booking.find({ propertyId: { $in: propertyIds } }));

    return JSON.parse(JSON.stringify(bookings))
  } catch (error) {
    console.error('Error fetching bookings for owner:', error);
    handleError(error)
  }
}
export async function getBookingByuserId(_id: string) {
  try {
    await connectToDatabase()

    const response = await populateAd(Booking.find({ userId: _id }));

    if (!response) throw new Error('Booking not found')

    return JSON.parse(JSON.stringify(response))
  } catch (error) {
    handleError(error)
  }
}
export async function getBookingById(_id: string) {
  try {
    await connectToDatabase()

    const response = await Booking.findById(_id)

    if (!response) throw new Error('Booking not found')

    return JSON.parse(JSON.stringify(response))
  } catch (error) {
    handleError(error)
  }
}

export async function getAllSiteVisitSummary(limit: number, page: number) {
  await connectToDatabase();

  const skipAmount = (page - 1) * limit;

  // Count total site visits
  const totalCount = await Sitevisit.countDocuments();

  // Get paginated site visits with populated propertyId
  const sitevisits = await Sitevisit.find()
    .skip(skipAmount)
    .limit(limit)
    .populate('propertyId');

  const results = [];

  for (const site of sitevisits) {
    const { date, timeSlots, propertyId } = site;

    const slotSummaries = await Promise.all(
      timeSlots.map(async (time: string) => {
        const bookings = await Booking.find({
          propertyId: propertyId._id,
          date,
          time,
          status: 'confirmed',
        }).populate('userId', 'firstName lastName phone');

        const clients = bookings.map((booking) => {
          const user = booking.userId as any;
          return {
            name: `${(user.firstName || '')} ${(user.lastName || '')}`.trim(),
            phone: user.phone || '',
          };
        });

        return {
          time,
          count: clients.length,
          clients,
        };
      })
    );

    results.push({
      propertyTitle: propertyId?.data?.title || 'Untitled Property',
      propertyId: propertyId?._id,
      date,
      slots: slotSummaries,
    });
  }

  return {
    data: JSON.parse(JSON.stringify(results)),
    totalPages: Math.ceil(totalCount / limit),
  };
}

export async function getSiteVisitSummary(ownerId: string) {
  await connectToDatabase();

  // Step 1: Get all site visits for this owner
  const sitevisits = await populate(Sitevisit.find({ ownerId }));

  const results = [];

  for (const site of sitevisits) {
    const { date, timeSlots, propertyId } = site;

    // Step 2: For each time slot, get confirmed bookings + client info
    const slotSummaries = await Promise.all(
      timeSlots.map(async (time: string) => {
        const bookings = await Booking.find({
          propertyId: propertyId._id,
          date,
          time,
          status: 'confirmed',
        }).populate('userId', 'firstName lastName phone');

        const clients = bookings.map((booking) => {
          const user = booking.userId as any;
          return {
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            phone: user.phone || '',
          };
        });

        return {
          time,
          count: clients.length,
          clients,
        };
      })
    );

    results.push({
      propertyTitle: propertyId?.data?.title || 'Untitled Property',
      propertyId: propertyId?._id,
      date,
      slots: slotSummaries,
    });
  }

  return results;
};
export async function getallBooking(limit = 16, page = 1) {
  try {
    await connectToDatabase();
    const conditions = {}
    const skipAmount = (Number(page) - 1) * limit
    const response = await populateAd(Booking.find(conditions)
      .skip(skipAmount)
      .limit(limit));
    const AdCount = await Booking.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(response)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
// UPDATE



// Function to delete a bookmark
export const deleteBookingX = async ({ booking, path }: CreateBookingParams) => {
  try {
    await connectToDatabase();
    const conditions = { $and: [{ propertyId: booking.propertyId }, { userId: booking.userId }] };
    const reportResponse = await Booking.findOne(conditions); // Find the matching bookmark

    let response = "Booking not found";
    if (reportResponse) {
      await Booking.deleteOne(conditions); // Delete the bookmark if it exists
      response = "Booking deleted successfully";
    }

    revalidatePath(path); // Revalidate the path to update cache
    return response;
  } catch (error) {
    handleError(error); // Handle any errors
  }
};
// Function to delete a bookmark
export const deleteBooking = async (_id: string) => {
  try {
    await connectToDatabase();
    // const conditions = { $and: [{ propertyId: booking.propertyId }, { userId: booking.userId }] };
    // const reportResponse = await Booking.findOne(conditions); // Find the matching bookmark

    //let response = "Booking not found";
    // if (reportResponse) {
    await Booking.findByIdAndDelete(_id); // Delete the bookmark if it exists
    const response = "Booking deleted successfully";
    //}

    // revalidatePath(path); // Revalidate the path to update cache
    return response;
  } catch (error) {
    handleError(error); // Handle any errors
  }
};