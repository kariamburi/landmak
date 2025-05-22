"use server"

import { CreateReportedParams, CreateSitevisitParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import { revalidatePath } from "next/cache"
import Ad from "../database/models/ad.model"
import User from "../database/models/user.model"
import Reported from "../database/models/reported.model"
import DynamicAd from "../database/models/dynamicAd.model"
import Sitevisit from "../database/models/sitevisit.model"


const populateAd = (query: any) => {
  return query
    .populate({ path: 'ownerId', model: User, select: '_id clerkId email firstName lastName photo businessname aboutbusiness businessaddress latitude longitude businesshours businessworkingdays phone whatsapp website facebook twitter instagram tiktok imageUrl verified' })
    .populate({
      path: 'propertyId',
      model: DynamicAd,
      select: '_id data views priority expirely adstatus inquiries whatsapp calls shared bookmarked abused subcategory organizer plan createdAt'
    });
};


export const createSitevisit = async ({ sitevisit, path }: CreateSitevisitParams) => {
  try {
    await connectToDatabase();
    //  const conditions = { adId: bookmark.adId };
    const conditions = { $and: [{ propertyId: sitevisit.propertyId }, { ownerId: sitevisit.ownerId }] };
    const reportsitevisit = await Sitevisit.findOne(conditions);  // Use findOne to find a single matching document

    let newsitevisit = {}
    let response = "Schedule exist!"
    if (!reportsitevisit) {
      newsitevisit = await Sitevisit.create({ ...sitevisit });
      response = "Schedule saved"
    }

    revalidatePath(path)
    return response;
  } catch (error) {
    handleError(error)
  }
}

// GET ONE Ad BY ID
export async function getSitevisitById(_id: string) {
  try {
    await connectToDatabase()

    const response = await Sitevisit.findById(_id)

    if (!response) throw new Error('Reported not found')

    return JSON.parse(JSON.stringify(response))
  } catch (error) {
    handleError(error)
  }
}
// GET ONE Ad BY ID
export async function getSitevisitByPropertyId(_id: string) {
  try {
    await connectToDatabase()

    const conditions = {propertyId: _id };
    const response = await Sitevisit.findOne(conditions); // Find the matching bookmark


    if (!response) throw new Error('Schedule not found')

    return JSON.parse(JSON.stringify(response))
  } catch (error) {
    handleError(error)
  }
}
export async function getallSitevisit(limit = 16, page = 1) {
  try {
    await connectToDatabase();
    const conditions = {}
    const skipAmount = (Number(page) - 1) * limit
    const response = await populateAd(Sitevisit.find(conditions)
      .skip(skipAmount)
      .limit(limit));
    const AdCount = await Sitevisit.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(response)), totalPages: Math.ceil(AdCount / limit) }
  } catch (error) {
    handleError(error)
  }
}
// UPDATE



// Function to delete a bookmark
export const deleteSitevisit = async ({ sitevisit, path }: CreateSitevisitParams) => {
  try {
    await connectToDatabase();
    const conditions = { $and: [{ propertyId: sitevisit.propertyId }, { ownerId: sitevisit.ownerId }] };
    const reportResponse = await Sitevisit.findOne(conditions); // Find the matching bookmark

    let response = "Sitevisit not found";
    if (reportResponse) {
      await Sitevisit.deleteOne(conditions); // Delete the bookmark if it exists
      response = "Sitevisit deleted successfully";
    }

    revalidatePath(path); // Revalidate the path to update cache
    return response;
  } catch (error) {
    handleError(error); // Handle any errors
  }
};